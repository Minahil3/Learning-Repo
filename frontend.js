import { Icon, IconButton, IconType, Text } from '@/ui';
import React, { useState } from 'react';
import DatePicker, { CalendarContainer } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './styles.module.css';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { updateDates } from '@/store/slices/reportsSlice';
import {
  convertStartDateToUTC,
  convertEndDateToUTC,
} from '@/utils/helpers/dateToUTC';

type Props = {
  dateFormat?: string;
  callback?: (dates: [Date, Date]) => void;
  fullWidth?: boolean;
};

interface CustomInputIconProps {
  value: string;
  onClick: () => void;
  fullWidth?: boolean;
}

interface CustomContainerProps {
  children: React.ReactNode;
}

interface CustomHeaderProps {
  date: Date | null;
  changeMonth: (month: number) => void;
}

const DateRange = ({
  dateFormat = 'dd/MM/yyyy',
  callback,
  fullWidth,
}: Props) => {
  const { dates } = useSelector((state: any) => state.reports);
  const [startDate, setStartDate] = useState(
    dates.startDate
      ? new Date(new Date(dates.startDate).setHours(0, 0, 0, 0))
      : new Date(new Date().setHours(0, 0, 0, 0)),
  );
  const dispatch = useDispatch();
  const [endDate, setEndDate] = useState(
    dates.endDate
      ? new Date(new Date(dates.endDate).setHours(0, 0, 0, 0))
      : (() => {
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          return nextDay;
        })(),
  );

  const onChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    const startUtc = start ? convertStartDateToUTC(start) : null;
    const endUtc = end ? convertEndDateToUTC(end) : null;

    if (startUtc && endUtc) {
      callback
        ? callback([start, end])
        : dispatch(updateDates([startUtc, endUtc]));
    }
  };

  return (
    <div className={classNames({ [styles.fullWidth]: fullWidth })}>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        popperClassName={styles.popper}
        calendarContainer={CustomContainer}
        customInput={
          <CustomInputIcon value='' onClick={() => {}} fullWidth={fullWidth} />
        }
        renderCustomHeader={CustomHeader}
        dayClassName={dayClassNames}
        dateFormat={dateFormat}
        wrapperClassName={classNames({ [styles.fullWidth]: fullWidth })}
        className={classNames({ [styles.fullWidth]: fullWidth })}
      />
    </div>
  );
};

const CustomInputIcon = ({
  value,
  onClick,
  fullWidth,
}: CustomInputIconProps) => {
  const inputStyles = classNames(styles.customInput, 'custom-icon-input', {
    [styles.fullWidth]: fullWidth,
  });

  return (
    <div className={inputStyles} onClick={onClick}>
      <Icon
        type={IconType.Calendar}
        width={24}
        height={24}
        fill='transparent'
      />
      <span>{value}</span>
    </div>
  );
};

const CustomContainer = ({ children }: CustomContainerProps) => {
  return (
    <div className={styles.calendarContainer}>
      <CalendarContainer className={styles.calendar}>
        <div style={{ position: 'relative' }}>{children}</div>
      </CalendarContainer>
    </div>
  );
};

const CustomHeader = ({ date, changeMonth }: CustomHeaderProps) => {
  const year = date?.getFullYear();
  const currentMonth = date?.toLocaleString('default', { month: 'long' });
  if (!date) {
    return null;
  }
  return (
    <div className={styles.customHeader}>
      <IconButton onClick={() => changeMonth(date?.getMonth() - 1)}>
        <Icon
          type={IconType.DropDownIcon}
          width={24}
          height={24}
          fill='transparent'
          rotate='90'
          stroke='var(--oliver-base-blue)'
        />
      </IconButton>
      <Text size='m' weight='light-medium'>{`${year} ${currentMonth}`}</Text>
      <IconButton onClick={() => changeMonth(date.getMonth() + 1)}>
        <Icon
          type={IconType.DropDownIcon}
          width={24}
          height={24}
          fill='transparent'
          rotate='-90'
          stroke='var(--oliver-base-blue)'
        />
      </IconButton>
    </div>
  );
};

const dayClassNames = () => {
  return `${styles.day}`;
};

export default DateRange;
