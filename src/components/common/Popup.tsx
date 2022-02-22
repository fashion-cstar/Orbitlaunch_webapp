

interface PopupProps {
    id?: string,
    children?: React.ReactNode,
    mainModalClasses?: any,
    contentClasses?: any,
    backgroundColorModal?: any,
    title: string,
    onPopupClose?(): void
}

export default function Popup({
    id,
    children,
    mainModalClasses,
    contentClasses,
    title,
    onPopupClose
}: PopupProps) {
    const customId = `${!!id ? id : 'custom-modal'}`;
    const customMainModalClasses = !mainModalClasses
        ? 'hidden bg-[#ab949447] overflow-y-auto overflow-x-hidden fixed z-50 justify-center items-center h-modal h-full inset-0'
        : mainModalClasses
    const customContentModalClasses = !contentClasses
        ? 'p-3 bg-[#06111C] rounded-2xl shadow dark:bg-gray-700'
        : contentClasses

    const handlePopupClose = () => {
        const modal = document.getElementById(customId);
        modal.style.display = "none";

        if (onPopupClose) {
            onPopupClose();
        }
    }

    return (
        <div
            id={customId}
            aria-hidden="true"
            role="dialog"
            className={customMainModalClasses}
        >
            <div className="px-4 w-full max-w-md h-full md:h-auto">
                <div className={customContentModalClasses} style={{overflow:'auto;', maxHeight:'calc(100vh - 125px);'}}>
                    <div className="flex flex-row">
                        <div className="flex-1 justify-start p-2">
                            <h3 className="text-xl font-medium dark:text-white text-white">{title}</h3>
                        </div>
                        <div className="flex justify-end p-2">
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-black-400 hover:text-gray-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                onClick={handlePopupClose}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}