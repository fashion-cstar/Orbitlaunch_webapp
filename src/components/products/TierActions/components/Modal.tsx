
interface PopupProps {
    isOpen?: boolean,
    children?: React.ReactNode,
    backgroundColorModal?: any,
    handleClose: () => void
}

const gradientColor = {
    backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Modal({
    isOpen,
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
                    {children}
                </div>
            </div>
        </div>
    )
}