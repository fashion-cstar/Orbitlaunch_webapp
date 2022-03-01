import React, { useMemo, useState, useEffect, useRef  } from 'react'
import Button from '@mui/material/Button';
import Modal from './Common/Modal';
import InputBox from './Common/InputBox';
import TextArea from './Common/TextArea';
import ReCAPTCHA from "react-google-recaptcha";
import { init, send, sendForm } from '@emailjs/browser';

export default function ProjectSubmitModal({isOpen, handleClose}:{isOpen:boolean, handleClose:() => void}) { 
    const [project_values, setProjectValues] = useState({project:'', developer:'', email:'', whitepaper:'', description:''})
    const form = useRef();
    function onCaptchaChange(value) {
        console.log("Captcha value:", value);
    } 
    const onSubmitProject = () => {
        let email_service:any = process.env.email_service            
        let templateParams = {
            from_name: project_values.project,
            project: project_values.project,
            developer: project_values.developer,
            email: project_values.email,
            whitepaper: project_values.whitepaper,
            description: project_values.description,
        }
        init(email_service.user_id)
        send(
            email_service.service_id,
            email_service.template_id,
            templateParams,
            email_service.user_id
          )
            .then((response) => {
              console.log('SUCCESS!', response.status, response.text);
            })
            .catch((err) => {
              console.log('FAILED...', err);
            });
    }

    return (
        <div>            
            <Modal
                isOpen={isOpen}
                header="Submit your project"
                handleClose={handleClose}                
            >
                <div className='m-6 md:w-[600px] lg:w-[700px]'>
                    {/* <div className='text-white text-[] mt-6'>
                        Submit your project
                    </div> */}
                    <div className='flex flex-col space-y-4 mt-6'>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">       
                            <InputBox onChange={(val:any) => setProjectValues({...project_values, project:val})} 
                                value={project_values.project} name="Project name" 
                                placeholder='Type something' type="text" required={true}/>
                            <InputBox onChange={(val:any) => setProjectValues({...project_values, developer:val})}
                                value={project_values.developer} name="Lead Project Developer" 
                                placeholder='Type something' type="text" required={true}/>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">       
                            <InputBox onChange={(val:any) => setProjectValues({...project_values, email:val})} 
                                value={project_values.email} name="Contact Email" 
                                placeholder='Type something' type="email" required={true}/>
                            <InputBox onChange={(val:any) => setProjectValues({...project_values, whitepaper:val})}  
                                value={project_values.whitepaper} name="Whitepaper / Litepaper URL" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                        <div className="flex justify-center">       
                            <TextArea onChange={(val:any) => setProjectValues({...project_values, description:val})}  
                                value={project_values.description} name="Project Description (What makes this project special)" 
                                placeholder='Type something' required={true}/>                    
                        </div>
                        <div className='flex justify-center items-center py-4 flex-col md:flex-row'>
                            <ReCAPTCHA
                                sitekey={process.env.ReCAPTCHA_key}
                                onChange={onCaptchaChange}
                            />,
                            <Button
                                variant="contained"                            
                                sx={{minWidth:"120px", height:"40px", borderRadius:"12px"}}
                                onClick={onSubmitProject}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
