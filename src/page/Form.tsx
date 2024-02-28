import React, {useState} from "react";
import Button from "../component/Button/Button";
import {Input, RangeInput, InputFile} from "../component/Input/Input";
import {useRef, useEffect} from "react";
import {FormData} from "../common/types";
import {Calendar} from "../component/Calendar/Calendar";
import {submitFormData} from "../data/data";

export const Form: React.FunctionComponent = () => {
    const firstNameRef = useRef<HTMLInputElement>(null)
    const lastNameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const rangeRef = useRef<HTMLInputElement>(null)
    const fileRef = useRef<HTMLInputElement>(null)
    const [disableInput, setDisableInput] = useState(false)
    const [disableInputLastName, setDisableInputLastName] = useState(false)
    const [disableInputEmail, setDisableInputEmail] = useState(false)
    const [disableInputRange, setDisableInputRange] = useState(false)
    const [disableInputFile, setDisableInputFile] = useState(false)
    const [disableInputCalender, setDisableInputCalender] = useState(false)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [value, setValue] = useState<number>(8)
    const [selected, setSelected] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        date: "",
        time: "",
    })

    /**
     * Check all input and when we get all true our button get true also,
     * and we can send our form
     */
    useEffect(() => {
        const enable:boolean =
            disableInputLastName &&
            disableInputEmail &&
            disableInputRange &&
            disableInputFile &&
            disableInputCalender

        if (enable) {
            setIsDisabled(enable)
        }
    }, [
        disableInput,
        disableInputLastName,
        disableInputEmail,
        disableInputRange,
        disableInputFile,
        disableInputCalender,
    ])

    /**
     * send form with all date from our components
     * @param e
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const valueFirstName = firstNameRef.current?.value
        const valueLastName = lastNameRef.current?.value
        const valueEmail = emailRef.current?.value
        const valueAge = rangeRef.current?.value
        const valueFile = fileRef.current?.files?.[0]
        const valueTime = selected.time
        const valueDate = selected.date

        const formData: FormData = {
            firstName: valueFirstName,
            lastName: valueLastName,
            email: valueEmail,
            age: valueAge,
            file: valueFile,
            time: valueTime,
            date: valueDate,
        }
        setSelected(formData)
        setIsDisabled(false)
        try {
            await submitFormData(formData)
            console.log('Form data submitted successfully:', formData)
        } catch (error) {
            console.error('Error submitting form data:', error)
        }
    }

    return (
        <section className={"bg-pale-purple"}>
            <div className={"container mx-auto flex flex-col items-center justify-center"}>
                <div className={"w-full max-w-474 py-120 pl-23 pr-25 max-sm:py-24 max-sm:max-w-390"}>

                    <h2 className={"text-2xl leading-[17px] font-medium text-dark-blue pb-8"}>
                        Personal Info
                    </h2>

                    <form className={"flex flex-col gap-6"} onSubmit={handleSubmit} autoComplete="on">
                        <Input title="First Name" id="firstName" type="text" required={true} inputRef={firstNameRef} IsDisable={setDisableInput} />

                        <Input title="Last Name" id="lastName" type="text" required={true} inputRef={lastNameRef} IsDisable={setDisableInputLastName}/>

                        <Input title="Email Address" id="email" type="email" required={true} inputRef={emailRef} IsDisable={setDisableInputEmail}/>

                        <RangeInput label="Age"
                                    id="inputRange"
                                    min={8}
                                    max={100}
                                    step={1}
                                    required
                                    inputRef={rangeRef}
                                    value={value}
                                    onChange={setValue}
                                    IsDisable={setDisableInputRange}
                        />

                        <InputFile title="Photo" id="file" required={true} inputRef={fileRef} IsDisable={setDisableInputFile}/>

                        <Calendar title={"Your workout"} items={selected} IsDisable={setDisableInputCalender} selectDate={setSelected}/>

                        <Button type={"submit"} title={'Send Application'} isDisabled={isDisabled}/>
                    </form>
                </div>
            </div>
        </section>
    )
}