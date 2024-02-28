import React, {useState, useEffect} from "react";

import {Weekdays} from "../../configs/Weekends";
import {Month} from "../../configs/Month";
import {fetch} from "../../data/data";
import {TProps, TimeSlot} from "./type";
import {API} from "../../common/types";

export const Calendar:React.FC<TProps> = (props) => {
    const {
        title,
        items,
        IsDisable,
        selectDate,
    } = props
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [month, setMonth] = useState<string>('')
    const [year, setYear] = useState<number>(0)
    const [lastDayOfMonth, setLastDayOfMonth] = useState<number>(0)
    const [firstDayOfMonth, setFirstDayOfMonth] = useState<number>(0)
    const [lastDayOfLastMonth, SetLastDayOfLastMonth] = useState<number>(0)
    const [data, setData] = useState<any[]>([])
    const [messenger, setMessenger ] = useState<string>('')
    const [visitMessenger, setVisitMessenger] = useState<boolean>(false)
    const [reservation, setReservation] = useState<boolean>(false)
    const [clickedDays, setClickedDays] = useState<number>(0)
    const [selectedTime, setSelectedTime] = useState<string>('')
    const timeSlots: TimeSlot[] = [
        { time: "12:00", id: 1 },
        { time: "13:15", id: 2 },
        { time: "14:30", id: 3 },
        { time: "15:45", id: 4 },
        { time: "16:00", id: 5 },
    ]
    /**
     * get API with national_holiday and observance
     */
    const fetchData = async () => {
        try {
            setLoading(true)
            const nationalHolidays = await fetch("PL", 2023, "national_holiday")
            const observanceHolidays = await fetch("PL", 2023, "observance")
            setData([...nationalHolidays, ...observanceHolidays])
        } catch (error) {
            setError("Error fetching data. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchDataPromise = fetchData()
        initializeCalendar()
        fetchDataPromise.catch((error) => console.error("Error in fetchDataPromise:", error))
    }, [])

    /**
     * create date Calendar, sets the first day of the month,
     * the last day of the current month, and the last day of the previous month.
     * we can write in currentYear = date.getFullYear() and get current year
     */
    const initializeCalendar = (): void => {
        const date = new Date()
        const currentMonth = Month[date.getMonth()]
        const currentYear = 2023
        date.setDate(1)
        const firstDayOfMonth = date.getDay()
        const lastDayOfLastMonth = new Date(currentYear, date.getMonth(), 0).getDate()
        const lastDayOfMonth = new Date(currentYear, date.getMonth() + 1, 0).getDate()

        setMonth(currentMonth)
        setYear(currentYear)
        setFirstDayOfMonth(firstDayOfMonth)
        setLastDayOfMonth(lastDayOfMonth)
        SetLastDayOfLastMonth(lastDayOfLastMonth)
    }
    /**
     * We get how many days we have in month 28 / 30 / 31.
     * @param lastDayOfMonth The last day of the month.
     */
    const generateDays = (lastDayOfMonth: number): number[] => {
        const result: number[] = []
        for (let i = 1; i <= lastDayOfMonth; i++) {
            result.push(i)
        }
        return result
    }
    /**
     * Generates for the last days of the previous month based on the first day of the current month
     * @param firstDayOfMonth The day of the week for the first day of the current month.
     *  and get day from last month
     */
    const generateLastDays = (firstDayOfMonth: number): number[] => {
        const result: number[] = []
        for (let i = firstDayOfMonth - 1; i > 0; i--) {
            result.push(lastDayOfLastMonth - i + 1)
        }
        return result
    }
    /**
     * Generate arrays of days for the current and previous months
     */
    const daysArray: number[] = generateDays(lastDayOfMonth)
    const daysLastArray: number[] = generateLastDays(firstDayOfMonth)
    /**
     * Filters an item based on its type and compares it with the selected type.
     *
     */
    const filterByType = (item: any, selectedType: string) => {
        const itemYear = new Date(item.date).getFullYear()
        const itemMonth = new Date(item.date).getMonth() + 1
        const itemType = item.type

        return itemYear === year && itemMonth === Month.indexOf(month) + 1 && itemType === selectedType
    }

    /**
     *  Filter data for national holidays and observances
     */
    const filteredNationalHolidays:API[] = data.filter((item) => filterByType(item, "NATIONAL_HOLIDAY"))
    const filteredObservances:API[] = data.filter((item) => filterByType(item, "OBSERVANCE"))
    /**
     * we check holidays in current month and get it
     */
    const filteredDaysNationalHolidays = filteredNationalHolidays.map(item => new Date(item.date).getDate())
    /**
     *  Handles the change of the month based on the specified direction.
     */
    const handleMonthChange = (direction: number) => {
        const newDate = new Date(year, Month.indexOf(month) + direction)
        setMonth(Month[newDate.getMonth()])
        setYear(newDate.getFullYear())
        const firstDay = new Date(newDate.getFullYear(), newDate.getMonth(), 1).getDay()
        setFirstDayOfMonth(firstDay)
        setLastDayOfMonth(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate())
    }
    /**
     * The click event for moving to the previous month.
     */
    const clickPrev = ():void => {
        if (Month.indexOf(month) > 0) {
            handleMonthChange(-1)
            setClickedDays(0)
            setReservation(false)
            setVisitMessenger(false)
        } else {
            handleMonthChange(0)
        }
    }
    /**
     * The click event for moving to the next month.
     */
    const clickNext = ():void => {
        if (Month.indexOf(month) < 11) {
            handleMonthChange(1)
            setClickedDays(0)
            setReservation(false)
            setVisitMessenger(false)
        } else {
            handleMonthChange(0)
        }
    }
    /**
     * The click event for selecting a day in the calendar. Show holiday if we have.
     */
    const handleDayClick = (event: React.MouseEvent<HTMLButtonElement>, day: number) => {
        event.preventDefault()

        setClickedDays(day)
        setSelectedTime('')
        const clickedDate = `${year}-${(Month.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const foundItem = filteredObservances.find(item => item.date === clickedDate)
        if (selectDate) {
            selectDate({
                ...items,
                date: clickedDate,
            })
        }
        if (foundItem) {
            setMessenger(foundItem.name)
        }
        if (IsDisable) {
            IsDisable(false)
        }
        setReservation(true)
        setVisitMessenger(!!foundItem)
    }
    /**
     * The click event for selecting time and add in Arr
     */
    const handleTimeClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()

        const clickedTime = event.currentTarget.querySelector('p')?.textContent;
        if (IsDisable) {
            IsDisable(true)
        }
        if (clickedTime) {
            setSelectedTime(clickedTime)
            if (selectDate) {
                selectDate({
                    ...items,
                    time: clickedTime,
                })
            }
        }
    }

    return (
        <div className={"calendar"}>
            <h6 className={"text-2xl leading-[17px] text-dark-blue font-medium mb-8"}>{title}</h6>
            {loading ? (
                <div>...loading</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : (
                <div className="flex flex-wrap gap-x-6 max-sm:flex-col">
                <div className={"row"}>
                    <p className={"mb-2 leading-3 text-dark-blue"}>
                        Date
                    </p>

                    <div className={"max-w-326 bg-white p-6 border rounded-lg border-lavender max-sm:order-3 max-sm:max-w-full"}>
                        <div className="flex items-center justify-between mb-22">
                            <span onClick={clickPrev} className={"cursor-pointer"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M9.5 16.866C8.83333 16.4811 8.83333 15.5189 9.5 15.134L18.5
                                    9.93782C19.1667 9.55292 20 10.034 20 10.8038L20 21.1962C20 21.966 19.1667
                                    22.4471 18.5 22.0622L9.5 16.866Z" fill={Month.indexOf(month) === 0 ? '#898DA9' : '#CBB6E5'}
                                    />
                                </svg>
                            </span>

                                <p className={"font-medium leading-3 text-dark-blue"}>{month} {year}</p>

                            <span onClick={clickNext} className={"cursor-pointer"}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <path d="M22.5 16.866C23.1667 16.4811 23.1667 15.5189 22.5 15.134L13.5
                                    9.93782C12.8333 9.55292 12 10.034 12 10.8038L12 21.1962C12 21.966
                                    12.8333 22.4471 13.5 22.0622L22.5 16.866Z" fill={Month.indexOf(month) === 11 ? '#898DA9' : '#CBB6E5'}/>
                                </svg>
                            </span>
                        </div>

                        <div className="grid grid-cols-7 gap-6 items-center justify-center text-center">
                            {Weekdays.map((day, index) => (
                                <p key={index} className={"font-medium leading-3 text-dark-blue"}>{day}</p>
                            ))}

                            {daysLastArray.map((day, index) => (
                                <p key={index} className={"opacity-0"}>{day}</p>
                            ))}

                            {daysArray.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={event => handleDayClick(event, day)}
                                    className={`transition-all duration-300 relative leading-3 z-[1] ${clickedDays === day ? 'text-white' : ''} ${(daysLastArray.length + day) % 7 === 0 ? 'text-grey cursor-not-allowed': ''}
                                    ${filteredDaysNationalHolidays.includes(day) ? 'text-grey cursor-not-allowed': ''}`}
                                    disabled={filteredDaysNationalHolidays.includes(day) || (daysLastArray.length + day) % 7 === 0}
                                    >

                                    {day}

                                    {clickedDays === day &&
                                        <svg className={"absolute top-0 left-0 -translate-x-[20%] -translate-y-[30%] z-[-1]"} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                            <circle cx="16" cy="16" r="16" fill="#761BE4"/>
                                        </svg>
                                    }
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {reservation &&
                    <div className={"max-sm:order-3 max-sm:mt-7"}>
                        <p className={"mb-2 leading-3 text-dark-blue"}>
                            Time
                        </p>

                    <div className={"grid gap-2 max-sm:grid-flow-row max-sm:grid-cols-4 max-sm:place-items-center"}>
                        {timeSlots.map(item => (
                            <div
                                key={item.id}
                                onClick={handleTimeClick}
                                className={`p-4 max-w-76 bg-white border rounded-lg border-lavender cursor-pointer ${selectedTime === item.time ? 'border-2 border-purple' : 'border border-lavender'}`}
                            >
                                <p className={"leading-3"}>
                                    {item.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>}

                {visitMessenger &&
                    <div className={"w-full flex items-center gap-2 mt-3"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M9 17C7.41775 17 5.87104 16.5308 4.55544 15.6518C3.23985 14.7727 2.21447 13.5233 1.60897 12.0615C1.00347 10.5997 0.84504 8.99113 1.15372 7.43928C1.4624 5.88743 2.22433 4.46197 3.34315 3.34315C4.46197 2.22433 5.88743 1.4624 7.43928 1.15372C8.99113 0.845037 10.5997 1.00346 12.0615 1.60896C13.5233 2.21447 14.7727 3.23985 15.6518 4.55544C16.5308 5.87103 17 7.41775 17 9C17 11.1217 16.1571 13.1566 14.6569 14.6569C13.1566 16.1571 11.1217 17 9 17ZM8.00667 13C8.00667 13.2652 8.11203 13.5196 8.29956 13.7071C8.4871 13.8946 8.74145 14 9.00667 14C9.27189 14 9.52624 13.8946 9.71378 13.7071C9.90131 13.5196 10.0067 13.2652 10.0067 13V8.40667C10.0067 8.27535 9.9808 8.14531 9.93055 8.02398C9.88029 7.90266 9.80664 7.79242 9.71378 7.69956C9.62092 7.6067 9.51068 7.53304 9.38935 7.48279C9.26803 7.43253 9.13799 7.40667 9.00667 7.40667C8.87535 7.40667 8.74531 7.43253 8.62399 7.48279C8.50266 7.53304 8.39242 7.6067 8.29956 7.69956C8.2067 7.79242 8.13305 7.90266 8.08279 8.02398C8.03254 8.14531 8.00667 8.27535 8.00667 8.40667V13ZM9 4C8.77321 4 8.55152 4.06725 8.36295 4.19325C8.17438 4.31925 8.02741 4.49833 7.94062 4.70786C7.85383 4.91738 7.83113 5.14794 7.87537 5.37037C7.91961 5.5928 8.02882 5.79712 8.18919 5.95748C8.34955 6.11785 8.55387 6.22706 8.7763 6.2713C8.99873 6.31555 9.22929 6.29284 9.43881 6.20605C9.64834 6.11926 9.82743 5.97229 9.95342 5.78372C10.0794 5.59515 10.1467 5.37346 10.1467 5.14667C10.1467 4.84255 10.0259 4.55089 9.81082 4.33585C9.59578 4.12081 9.30412 4 9 4Z" fill="#CBB6E5"/>
                        </svg>

                        <p className={"text-sm leading-3 text-dark-blue"}>
                            It is Polish {messenger}.
                        </p>
                    </div>
                }
            </div>
            )}
        </div>
    )
}