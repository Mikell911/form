import React, {ChangeEventHandler, useState} from "react";
import {Props, PropsFile, PropsRange} from "./type";

export const Input: React.FC<Props> = (props) => {
    const {
        title,
        required,
        type,
        IsDisable,
        inputRef,
        ...inputProps
    } = props
    const [value, setValue] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    /**
     * get value from input
     * @param event
     */
    const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
        setValue(event.target.value)
        setError(null)
        if (event.target.value.length > 1 && IsDisable) {
            IsDisable(true)
        }
    }
    /**
     * validation input
     * must be required and type
     */
    const handleBlur = (): void => {
        if (required && !value.trim()) {
            setError("Field cannot be empty");
        } else if (type === "email" && !isValidEmail(value)) {
            setError("Please use correct formatting. Example: address@email.com")
        } else if (value.length < 2) {
            setError("Please write correct")
        }
    }
    /**
     * validation email
     * @param email
     */
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    return (
    <div className="form__row">
        <label htmlFor={inputProps.id} className={"block mb-2 text-dark-blue leading-3"}>{title}</label>
        <input
            ref={inputRef}
            required={required}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="on"
            {...inputProps}
            className={
                "w-full bg-white border rounded-lg border-lavender py-18 px-4 leading-3 font-medium text-dark-blue max-h-12 " +
                "outline-none focus:border-purple focus:border-2  " +
                (error ? "border-red bg-lightgrey" : "bg-white")
            }/>
        {error && <div className={"mt-2 flex gap-2"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1C7.41775 1 5.87104 1.46919 4.55544 2.34824C3.23985 3.22729 2.21447 4.47672 1.60897 5.93853C1.00347 7.40034 0.84504 9.00887 1.15372 10.5607C1.4624 12.1126 2.22433 13.538 3.34315 14.6569C4.46197 15.7757 5.88743 16.5376 7.43928 16.8463C8.99113 17.155 10.5997 16.9965 12.0615 16.391C13.5233 15.7855 14.7727 14.7602 15.6518 13.4446C16.5308 12.129 17 10.5822 17 9C17 6.87827 16.1571 4.84344 14.6569 3.34315C13.1566 1.84285 11.1217 1 9 1ZM8.00667 5C8.00667 4.73478 8.11203 4.48043 8.29956 4.29289C8.4871 4.10536 8.74145 4 9.00667 4C9.27189 4 9.52624 4.10536 9.71378 4.29289C9.90131 4.48043 10.0067 4.73478 10.0067 5V9.59333C10.0067 9.72465 9.9808 9.85469 9.93055 9.97602C9.88029 10.0973 9.80664 10.2076 9.71378 10.3004C9.62092 10.3933 9.51068 10.467 9.38935 10.5172C9.26803 10.5675 9.13799 10.5933 9.00667 10.5933C8.87535 10.5933 8.74531 10.5675 8.62399 10.5172C8.50266 10.467 8.39242 10.3933 8.29956 10.3004C8.2067 10.2076 8.13305 10.0973 8.08279 9.97602C8.03254 9.85469 8.00667 9.72465 8.00667 9.59333V5ZM9 14C8.77321 14 8.55152 13.9327 8.36295 13.8068C8.17438 13.6808 8.02741 13.5017 7.94062 13.2921C7.85383 13.0826 7.83113 12.8521 7.87537 12.6296C7.91961 12.4072 8.02882 12.2029 8.18919 12.0425C8.34955 11.8822 8.55387 11.7729 8.7763 11.7287C8.99873 11.6845 9.22929 11.7072 9.43881 11.794C9.64834 11.8807 9.82743 12.0277 9.95342 12.2163C10.0794 12.4048 10.1467 12.6265 10.1467 12.8533C10.1467 13.1574 10.0259 13.4491 9.81082 13.6641C9.59578 13.8792 9.30412 14 9 14Z" fill="#ED4545"/>
            </svg>
            <p className={"text-sm max-w-52 text-dark-blue leading-[14px]"}>{error}</p>
        </div>}
    </div>
    )
}


export const RangeInput: React.FC<PropsRange> = (props) => {
    const {
        label,
        value,
        required,
        inputRef,
        onChange,
        step,
        onDragStart,
        onDragEnd,
        IsDisable,
        ...inputProps
    } = props

        const percentagePosition:number = Math.floor(((value ?? inputProps.min) / (inputProps.max - inputProps.min)) * 100)
        const adjusted: number = percentagePosition - inputProps.min

        const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (evt):void => {
            if (!onChange) return
            const {value} = evt.target
            onChange(+value)
            if (IsDisable) {
                IsDisable(true);
            }
        }

        return (
            <div className="form__row">
                <label htmlFor={inputProps.id} className={"block mb-29 leading-3 text-dark-blue"}>{label}</label>

                <div className={"relative max-w-420 mb-34"}>
                    <span className={"text-xs text-dark-blue absolute left-0 top-0 -translate-y-full"}>{inputProps.min}</span>
                    <span className={"text-xs text-dark-blue absolute right-0 top-0 -translate-y-full"}>{inputProps.max}</span>
                    <input
                        ref={inputRef}
                        {...inputProps}
                        required={required}
                        value={value}
                        type={"range"}
                        onChange={handleRangeChange}
                        className={"w-full h-2 appearance-none range-slider opacity-0 cursor-pointer relative z-[1]"}
                    />

                    <div className={"absolute top-1/2 h-1 w-full bg-lavender rounded-lg"}
                         style={{
                             transform: 'translateY(-50%)',
                         }}>
                    </div>
                    <div className={"absolute top-1/2 h-1 bg-blue rounded-lg left-0"}
                         style={{
                             width: `${adjusted}%`,
                             transform: 'translateY(-50%)',
                    }}></div>

                    <div className={"absolute top-1/2 w-4 h-4 bg-purple rounded-lg cursor-pointer"}
                         style={{
                             left: `${adjusted}%`,
                             transform: 'translate(-7px, -50%)',
                         }}>
                    </div>

                   <div className={"absolute"} style={{left: `${adjusted}%`,transform: 'translateX(-18px)',}}>
                        <svg width="37" height="31" viewBox="0 0 37 31" fill="none">
                            <mask id="path-1-inside-1_19_95" fill="white">
                                <path fillRule="evenodd" clipRule="evenodd" d="M22.3971 6L18.5 0L14.6029 6H4C1.79086 6 0 7.79086 0 10V27C0 29.2091 1.79086 31 4 31H33C35.2091 31 37 29.2091 37 27V10C37 7.79086 35.2091 6 33 6H22.3971Z"/>
                            </mask>
                            <path fillRule="evenodd" clipRule="evenodd" d="M22.3971 6L18.5 0L14.6029 6H4C1.79086 6 0 7.79086 0 10V27C0 29.2091 1.79086 31 4 31H33C35.2091 31 37 29.2091 37 27V10C37 7.79086 35.2091 6 33 6H22.3971Z" fill="#FAF9FA"/>
                            <path d="M18.5 0L19.3386 -0.544705L18.5 -1.83586L17.6614 -0.544705L18.5 0ZM22.3971 6L21.5585 6.5447L21.8542 7H22.3971V6ZM14.6029 6V7H15.1458L15.4415 6.5447L14.6029 6ZM17.6614 0.544705L21.5585 6.5447L23.2357 5.4553L19.3386 -0.544705L17.6614 0.544705ZM15.4415 6.5447L19.3386 0.544705L17.6614 -0.544705L13.7643 5.4553L15.4415 6.5447ZM4 7H14.6029V5H4V7ZM1 10C1 8.34315 2.34315 7 4 7V5C1.23858 5 -1 7.23858 -1 10H1ZM1 27V10H-1V27H1ZM4 30C2.34315 30 1 28.6569 1 27H-1C-1 29.7614 1.23858 32 4 32V30ZM33 30H4V32H33V30ZM36 27C36 28.6569 34.6569 30 33 30V32C35.7614 32 38 29.7614 38 27H36ZM36 10V27H38V10H36ZM33 7C34.6569 7 36 8.34315 36 10H38C38 7.23858 35.7614 5 33 5V7ZM22.3971 7H33V5H22.3971V7Z" fill="#CBB6E5" mask="url(#path-1-inside-1_19_95)"/>
                        </svg>

                        <span className={"text-xs font-medium text-purple absolute top-1/2 left-1/2"}
                              style={{
                                  transform: 'translate(-50%, -40%)',
                              }}
                        >{value}</span>
                   </div>
                </div>
            </div>
        )
    }

export const InputFile: React.FC<PropsFile> = (props) => {
    const {
        title,
        id,
        inputRef,
        IsDisable,
        required,
    } = props
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDeleteButtonHovered, setIsDeleteButtonHovered] = useState<boolean>(false);
    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

    /**
     * get file from input type file and show in console
     * @param event
     */
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSelectedFile = event.target.files && event.target.files[0]
        setSelectedFile(newSelectedFile)
        if (IsDisable) {
            IsDisable(!!newSelectedFile)
        }
    }

    /**
     * show name file and button delete with hover
     * if we clear uor input we have timeout .5s click in input (Disable)
     */
    const handleDeleteFile = (): void => {
        setSelectedFile(null)
        if (IsDisable) {
            IsDisable(false)
        }
        if (inputRef.current) {
            inputRef.current.value = ''
            setIsDeleteButtonHovered(false)
            setIsInputDisabled(true)
            setTimeout(() => {
                setIsInputDisabled(false)
            }, 500)
        }
    }

    return (
        <div className="form__row">
            <p className={"mb-2 leading-3 text-dark-blue"}>{title}</p>
                <label htmlFor={id}>
                    <div className={"h-24 mb-6 bg-white border border-solid rounded-lg border-lavender flex flex-col justify-center items-center"}>

                    <input
                        id={id}
                        type={"file"}
                        ref={inputRef}
                        onChange={handleFileChange}
                        required={required}
                        className={"w-full hidden"}
                        disabled={isInputDisabled}
                    />

                    {selectedFile ? (
                        <div className={"flex gap-1.5"}>
                            <span className="font-medium text-dark-blue">{selectedFile.name}</span>

                            <button
                                onClick={handleDeleteFile}
                                onMouseEnter={() => setIsDeleteButtonHovered(true)}
                                onMouseLeave={() => setIsDeleteButtonHovered(false)}
                                className="cursor-pointer">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2
                                    6.477 6.477 2 12 2ZM9.879 8.464C9.69946 8.28275 9.45743 8.17697 9.20245 8.16832C8.94748
                                    8.15967 8.69883 8.2488 8.50742 8.41747C8.31601 8.58613 8.1963 8.82159 8.1728 9.07562C8.14929
                                    9.32966 8.22378 9.58308 8.381 9.784L8.465 9.879L10.585 11.999L8.465 14.121C8.28375 14.3005
                                    8.17797 14.5426 8.16932 14.7975C8.16067 15.0525 8.2498 15.3012 8.41847 15.4926C8.58713
                                    15.684 8.82258 15.8037 9.07662 15.8272C9.33066 15.8507 9.58408 15.7762 9.785 15.619L9.879
                                    15.536L12 13.414L14.121 15.536C14.3005 15.7173 14.5426 15.823 14.7975 15.8317C15.0525
                                    15.8403 15.3012 15.7512 15.4926 15.5825C15.684 15.4139 15.8037 15.1784 15.8272 14.9244C15.8507
                                    14.6703 15.7762 14.4169 15.619 14.216L15.536 14.121L13.414 12L15.536 9.879C15.7173 9.69946
                                    15.823 9.45743 15.8317 9.20245C15.8403 8.94748 15.7512 8.69883 15.5825 8.50742C15.4139 8.31601
                                    15.1784 8.1963 14.9244 8.1728C14.6703 8.14929 14.4169 8.22378 14.216 8.381L14.121 8.464L12
                                    10.586L9.879 8.464Z" fill={isDeleteButtonHovered ? '#ED4545' : '#000853'} />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <p className={"text-purple"}>
                            <span className="underline cursor-pointer mr-1">Upload a file </span>
                            <span className="text-grey">or drag and drop here</span>
                        </p>
                    )}
                </div>
                </label>
        </div>
    )
}