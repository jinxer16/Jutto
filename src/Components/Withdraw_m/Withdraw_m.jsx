import React, {useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import m1 from "../Assets/m1.png"
import { MdArrowBackIos } from 'react-icons/md'
import "./Withdraw_m.css"
import ReactLoading from 'react-loading';
import { financeAppContractAddress, financeAppContract_Abi } from '../../utilies/Contract';
import {withdrawInfo} from '../../Redux/withdrawDetail/action'
import { toast } from 'react-toastify';
import {useSelector, useDispatch}  from "react-redux"

function Withdraw_m(props) {
    
  let acc = useSelector((state) => state.connect?.connection);
    let {withdrawDetail} = useSelector((state)=>state.withDrawInfo);
  const dispatch = useDispatch()
    const [loader, setLoader] = useState(false);
    console.log("withdrawDetail",withdrawDetail);
    const getDetail = async () => {
        try {
         if (acc == "No Wallet") {
            console.log("No Wallet");
          } else if (acc == "Wrong Network") {
            console.log("Wrong Wallet");
          } else if (acc == "Connect Wallet") {
            console.log("Connect Wallet");
          }else{
            dispatch(withdrawInfo(acc));
            }
            } catch (e) {
                console.log("error while get detiail",e);
            }

    }
    useEffect(() => {
        getDetail()
    }, [acc]);
    const withdrawAmount = async () => {
        try {
            if (acc == "No Wallet") {
                toast.info("No Wallet");
              } else if (acc == "Wrong Network") {
                toast.info("Wrong Wallet");
              } else if (acc == "Connect Wallet") {
                toast.info("Connect Wallet");
              }else{
                setLoader(true)
                if(withdrawDetail.all_val > 0 ){

                    const web3 = window.web3;
                    let financeAppcontractOf = new web3.eth.Contract(financeAppContract_Abi, financeAppContractAddress);
                    await financeAppcontractOf.methods.Withdrawal().send({
                        from: acc 
                    });
                    getDetail()
                    props.onHide()
                    setLoader(false)
                    dispatch(withdrawInfo(acc));
                    toast.success("successfully withdraw");
                }else{
                    setLoader(false);
                    toast.info("You don't have any reward yet!")
                }
            }
        }
        catch (e) {
            setLoader(false)
            console.log(e);
    }
}
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
                                        <Button onClick={() => props.onHide()} className='color-black' style={{ backgroundColor: "#ffbf00", border: "1px solid #ffbf00" }}><MdArrowBackIos ></MdArrowBackIos></Button>
                                    </div>
                                    <h4 className='ms-5 modal_h4'>Withdraw</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className='body_m_bg bb'>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>Unlock principal</p>
                                    <p className='witddraw_p'>{withdrawDetail.unlock} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>Cycle reward</p>
                                    <p className='witddraw_p'>{withdrawDetail.statics} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>1st level Income</p>
                                    <p className='witddraw_p'>{withdrawDetail.capitals} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>2nd level Income</p>
                                    <p className='witddraw_p'>{withdrawDetail.level2Income} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>3-6 level Income</p>
                                    <p className='witddraw_p'>{withdrawDetail.level3_6Income} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>7-10 level Income</p>
                                    <p className='witddraw_p'>{withdrawDetail.level7_10Income} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>11-14 level Income</p>
                                    <p className='witddraw_p'>{withdrawDetail.level11_14Income} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>Top player reward</p>
                                    <p className='witddraw_p'>{withdrawDetail.top} BUSD</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>CTO</p>
                                    <p className='witddraw_p'>{withdrawDetail.cto} BUSD</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </Modal.Body>
                <Modal.Footer className='footer_m_bg'>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>Total withdraw</p>
                                    <p className='witddraw_p'>{withdrawDetail.all_val} BUSD</p>
                                </div>
                            </div>
                        </div>

                        {/* {toatlWithdraw && <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex justify-content-between">
                                    <p className='text-white'>Maximum withdraw</p>
                                    <p className='witddraw_p'>{available_withdraw} BUSD</p>
                                </div>
                            </div>
                        </div>} */}
                    </div>
                    <Button className='s_d_Ws  w-100' onClick={() => { withdrawAmount() }}>{loader ? <ReactLoading type="spin" color="#ffffff" className='mb-2 mx-auto' height={30} width={30} /> : "Withdraw"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Withdraw_m
