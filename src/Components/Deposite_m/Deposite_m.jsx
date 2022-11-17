import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { MdArrowBackIos } from 'react-icons/md'
import "./Deposite_m.css"
import m1 from "../Assets/1200px-Dai_Logo.png"
import { financeAppContractAddress, financeAppContract_Abi, juttoTokenAddress, juttoTokenAbi, busdtokenAbi, busdTokenAddress } from '../../utilies/Contract';
import {useSelector, useDispatch}  from "react-redux";
import {getpoolDetail, getUserRank} from '../../Redux/poolInfo/action';
import {getRemaintime} from '../../Redux/remaintime/action';
import {withdrawInfo} from '../../Redux/withdrawDetail/action'
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
function Deposite_m(props) {
    let acc = useSelector((state) => state.connect?.connection);
    let [loader, setloader] = useState(false)
    let [depositandintrest, setdepositandintrest] = useState("50");
    let [isOption, setIsOption] = useState(false);
    let [isToken, setIsToken]= useState("");
    const dispatch = useDispatch();
    const checkBalance = async () => {
        try {
            const web3 = window.web3;
            if(isToken == "" || isToken == "busd"){
                const busdToken = new web3.eth.Contract(busdtokenAbi, busdTokenAddress);
                let bal =await busdToken.methods.balanceOf(acc).call();
                bal = web3.utils.fromWei((bal));
                return bal
            }else{
                    const token = new web3.eth.Contract(juttoTokenAbi, juttoTokenAddress);
                    let bal =await token.methods.balanceOf(acc).call();
                    bal = web3.utils.fromWei((bal));
                    return bal
                }
            
        } catch (error) {
            console.error("error while check balance", error);
        }
    }

    const depositAmount = async () => {
        try {
            if (acc == "No Wallet") {
                toast.info("No Wallet");
              } else if (acc == "Wrong Network") {
                toast.info("Wrong Wallet");
              } else if (acc == "Connect Wallet") {
                toast.info("Connect Wallet");
              }else{
                const web3 = window.web3;
                const contract = new web3.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
                const token = new web3.eth.Contract(juttoTokenAbi, juttoTokenAddress);
                const busdToken = new web3.eth.Contract(busdtokenAbi, busdTokenAddress);
                if (parseFloat(depositandintrest) >= 50 && parseFloat(depositandintrest) <= 2000) {
                    const {maxDeposit, referrer} = await contract.methods.userInfo(acc).call();
                    if(parseFloat(web3.utils.fromWei(maxDeposit)) == 0 && isToken == ""){
                        toast.info("Select Token First")
                    }else{
                        let value;
                        let approveAmount;
                        if(isToken == "jutto"){
                            let tokenPer = await contract.methods.tokenper().call();
                            approveAmount = depositandintrest / tokenPer;
                            approveAmount = parseFloat(approveAmount) + 0.0000111;
                            approveAmount = web3.utils.toWei((approveAmount).toString());

                            value = web3.utils.toWei((depositandintrest).toString());
                        }else{
                            approveAmount = web3.utils.toWei((depositandintrest).toString());
                            value = web3.utils.toWei(depositandintrest);
                        }
                        console.log("value", value);
                        let userTokenBalance = await checkBalance();
                        if( parseFloat(userTokenBalance) >= parseFloat(web3.utils.fromWei(value))){
                            if(parseFloat(value) >= parseFloat(web3.utils.fromWei(maxDeposit))){
                                if (parseInt(value) % 50 === 0) {
                                    if (referrer == '0x0000000000000000000000000000000000000000') {
                                        toast.error('please Register Account 1st ')
                                    }else {
                                        setloader(true)
                                        
                                        if (isToken == "" || isToken == "busd") {
                                            await busdToken.methods.approve(financeAppContractAddress,approveAmount).send({
                                                from:acc
                                            });
                                            await contract.methods.deposit(busdTokenAddress,value).send({
                                                from:acc
                                         })
                                        }else{
                                            console.log("approveAmount",approveAmount)
                                            await token.methods.approve( financeAppContractAddress,approveAmount).send({
                                                from:acc
                                            });
                                            console.log("value",value)
                                            await contract.methods.deposit(juttoTokenAddress,value).send({
                                                from:acc
                                         })
                                        }
                                        checkFirstTime()
                                     dispatch(getRemaintime())
                                     dispatch(getpoolDetail())
                                     dispatch(getUserRank(acc))
                                     dispatch(withdrawInfo(acc))
                                     props.onHide();
                                     toast.success("Amount Deposited successfully")
                                     setloader(false)
                                    }
                                }
                                else {
                                    toast.error('please enter value in ratio 50 ')
                                }
                            }else{
                                toast.info(`please enter value ${web3.utils.fromWei(maxDeposit)} or above`)
                            }
                        }else{
                            toast.info("Insuffiecent Token")
                        }
                    }
                }else{
                    toast.info('value must be greater then 50 and less then 2000 ')
                }
              }
        } catch (error) {
            setloader(false)
            console.error("error while deposit amount", error.message);
        }
    }

    const checkFirstTime = async () => {
        try {
            if (  acc != "No Wallet" &&
            acc != "Wrong Network" &&
            acc != "Connect Wallet") {
                const web3 = window.web3;
                const contract = new web3.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
                let {maxDeposit} = await contract.methods.userInfo(acc).call();
                setIsOption(parseFloat(maxDeposit) > 0 ? false : true)
              } 
        } catch (error) {
            console.error("error while check first time", error);
        }
    };
    useEffect(()=>{
        checkFirstTime()
    },[acc])
    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className='modal_bg'>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-lg-12 p-o">
                                <div className="d-flex">
                                    <div className="icons_m">
                                        <Button onClick={() => props.onHide()} style={{ backgroundColor: "#ffbf00", border: "1px solid #ffbf00" }}><MdArrowBackIos ></MdArrowBackIos></Button>
                                    </div>
                                    <h4 className='ms-5 modal_h4'>Deposit</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className='body_m_bg'>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <input type="number" min="50" max="2000" value={depositandintrest} onChange={(e)=>{
                                    setdepositandintrest(e.target.value)
                                }} className='input_modal' placeholder='50' />
                                <p className='modal_pa'>Minimum deposit 50 BUSD. A ratio of 50 max 2000</p>
                            </div>
                            { isOption && <div className='col-lg-4'>
                                <select name="" id="" onChange={(e)=>{setIsToken(e.target.value)}}>
                                    <option value="" selected disabled>Select Token</option>
                                    <option value="jutto">JUTTO</option>
                                    <option value="busd">BUSD</option>
                                </select>
                            </div>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className='footer_m_bg'>
                    <Button className='s_d_Ws  w-100' onClick={depositAmount}>{loader ? <ReactLoading type="spin" color="#ffffff" className='mb-2 mx-auto' height={30} width={30} /> : "Confirm"} </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Deposite_m
