import React, { useEffect, useState } from 'react'
import { BsArrowUpRight } from 'react-icons/bs';
import { BsArrowDownRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { financeAppContractAddress, financeAppContract_Abi } from '../../utilies/Contract';
import RepetationComponent from '../My_team/RepetationComponent';
import './Reward_info.css'
import {useSelector} from 'react-redux'
import Web3 from 'web3';
const web3Supply = new Web3("https://matic-mumbai.chainstacklabs.com")
function Reward_info() {

	let acc = useSelector((state) => state.connect?.connection);
	const [reward, setReward] = useState("")
	const [dayTopUsers, setDayTopUsers] = useState([])
	const getDetail = async () => {
			try {
				if (acc == "No Wallet") {
					console.log("No Wallet");
				  } else if (acc == "Wrong Network") {
					console.log("Wrong Wallet");
				  } else if (acc == "Connect Wallet") {
					console.log("Connect Wallet");
				  }else{
				const web3 = window.web3;
				let obj = {};
				let financeAppcontractOf = new web3.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
                let {level}=await financeAppcontractOf.methods.userInfo(acc).call();
				console.log("level", level);
				if(level == 0){
					setReward("")
				}else if(level == 1){
					setReward("Player")
				}else if(level == 2){
					setReward("Scorer")
				}else if(level == 3){
					setReward("All Rounder")
				}else if(level == 4){
					setReward("Vice Captain")
				}else if(level == 5){
					setReward("Captain")
				}
				
	
			}
			} catch (e) {
				toast.error(e.message);
			}
	}
	const getTopUser = async () => {
		try {
			let financeAppcontractOf = new web3Supply.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
			let getCurDays = await financeAppcontractOf.methods.getCurDay().call();
				let arr = []
				for (let index = 0; index < 3; index++) {
					let topUser = await financeAppcontractOf.methods.dayTopUsers(getCurDays, index).call();
					arr.push(topUser)
				}
				setDayTopUsers(arr)
		} catch (error) {
			console.error("error while get top user", error);
		}
	}
	useEffect(() => {
		getDetail()
		getTopUser()
	}, [acc]);

	return (
		<div>
			<h3 className='text-white mt-5 mb-3'>Reward Info</h3>
			<RepetationComponent />
			<div className="main_deposit">
			{reward != "" && (
				<div className="second_deposit">
					<div className="fi_line">
						<p>Rank</p>
						<p>{reward}</p>
					</div>
				</div>
			)}
			</div>
			<div className="main_deposit mb-3">
				<div className="second_deposit">
					<div className="fi_line">
						<p>Top 5 Players</p>
						{
							dayTopUsers.length===0?(
								<p>...0 Player</p>
							):(	
								<></>
							)
						}
					</div>
					
					{dayTopUsers.map((item, index) => {
						return (
							item != "0x0000000000000000000000000000000000000000" &&
							(<div className="pehli_line" key={index}>
								<div className="nill">{index + 1} <span className='ms-2 me-2'>|</span><span className='spn'> {item}</span></div>
								<div className='group_img'><BsArrowUpRight></BsArrowUpRight></div>
							</div>)
						)
					})}
				</div>
			</div>
		</div>
	)
}
export default Reward_info