import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import Modal from 'src/components/common/Modal';
import InputBox from './Common/InputBox';
import TextArea from './Common/TextArea';
import ReCAPTCHA from "react-google-recaptcha";
import { init, send, sendForm } from '@emailjs/browser';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

export default function ProjectSubmitModal({ isOpen, handleClose }: { isOpen: boolean, handleClose: () => void }) {
    const [project_values, setProjectValues] = useState({ project: '', developer: '', email: '', whitepaper: '', description: '' })
    const [isVerified, setIsVerified] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAllFilled, setIsAllFilled] = useState(false)
    const form = useRef();

    useEffect(() => {
        if (project_values.project.trim() !== '' &&
            project_values.developer.trim() !== '' &&
            project_values.email.trim() !== '' &&
            project_values.whitepaper.trim() !== '' &&
            project_values.description.trim() !== '') {
            setIsAllFilled(true)
        } else {
            setIsAllFilled(false)
        }
    }, [project_values])
    function onCaptchaChange(value) {
        console.log("Captcha value:", value);
        setIsVerified(true)
    }

    const onSubmitProject = () => {
        let email_service: any = process.env.email_service
        let templateParams = {
            from_name: project_values.project,
            project: project_values.project,
            developer: project_values.developer,
            email: project_values.email,
            whitepaper: project_values.whitepaper,
            description: project_values.description,
        }
        setIsSubmitting(true)
        init(email_service.user_id)
        send(
            email_service.service_id,
            email_service.template_id,
            templateParams,
            email_service.user_id
        )
            .then((response) => {
                setIsSubmitting(false)
                setIsSubmitted(true)
                setTimeout(() => {
                    handleClose()
                }, 2000)
                console.log('SUCCESS!', response.status, response.text);
            })
            .catch((err) => {
                setIsSubmitting(false)
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
                    <div className='flex flex-col space-y-4 mt-6'>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, project: val })}
                                id="sp_project"
                                value={project_values.project} name="Project name"
                                placeholder='Type something' type="text" required={true} />
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, developer: val })}
                                id="sp_developer"
                                value={project_values.developer} name="Lead Project Developer"
                                placeholder='Type something' type="text" required={true} />
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, email: val })}
                                id="sp_email"
                                value={project_values.email} name="Contact Email"
                                placeholder='Type something' type="email" required={true} />
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, whitepaper: val })}
                                id="sp_whitepaper"
                                value={project_values.whitepaper} name="Whitepaper / Litepaper URL"
                                placeholder='Type something' type="url" required={true} />
                        </div>
                        <div className="flex justify-center">
                            <TextArea onChange={(val: any) => setProjectValues({ ...project_values, description: val })}
                                id="sp_description"
                                value={project_values.description} name="Project Description (What makes this project special)"
                                placeholder='Type something' required={true} />
                        </div>
                        {isAllFilled && <div className='flex justify-center items-center py-4 flex-col md:flex-row gap-4'>
                            <ReCAPTCHA
                                sitekey={process.env.ReCAPTCHA_key}
                                onChange={onCaptchaChange}
                            />
                            {isVerified && <>
                                {isSubmitting ?
                                    <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                                        <CircularProgress />
                                    </Fade> :
                                    <Button
                                        variant="contained"
                                        sx={{ minWidth: "120px", height: "40px", borderRadius: "12px" }}
                                        onClick={onSubmitProject}
                                    >
                                        {isSubmitted ? "Thank you" : "Submit"}
                                    </Button>}
                            </>}
                        </div>}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
