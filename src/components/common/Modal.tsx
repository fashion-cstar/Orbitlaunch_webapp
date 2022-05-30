
interface PopupProps {
    isOpen?: boolean,
    children?: React.ReactNode,
    header?: string,
    backgroundColorModal?: any,
    handleClose: () => void
}

const gradientColor = {
    backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Modal({
    isOpen,
    header,
    children,
    handleClose
}: PopupProps) {

    const handleWindowClick = (event) => {
        const modal = document.getElementById("orbit-pad-modal");
        if (event.target.id == modal.id) {
            handleClose()
        }
    }
    return (
        <div
            id="orbit-pad-modal"
            aria-hidden="true"
            role="dialog"
            style={{ backgroundColor: '#ffffff20', display: isOpen ? "flex" : "none" }}
            className="pad-modal-fadeIn overflow-y-auto overflow-x-hidden fixed right-0 left-0 z-50 justify-center items-center h-modal h-full inset-0"
            onClick={(e) => handleWindowClick(e)}
        >
            <div className="px-4 w-full w-auto h-auto mt-8" style={{overflow:'auto', maxHeight:'calc(100vh - 125px)'}}>
                <div className={`p-3 rounded-2xl shadow dark:bg-gray-700`} style={gradientColor}>
                    <div className="flex flex-row justify-between mt-2">
                        <div className='text-white text-[24px] md:text-[32px] ml-6'>
                            {header}
                        </div>
                        <div className="flex justify-end p-2">
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-black-400 hover:text-gray-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                onClick={handleClose}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}