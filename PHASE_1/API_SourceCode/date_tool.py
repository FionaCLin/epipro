from datetime import datetime
import re


#input date string of format
#^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx) to (\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$
#YYYY-MM-DDTHH:MM:SS
#check whether the time order is wrong
def check_date(date_line):
    date_line_format = re.compile('^([^ ]*) to (.*)$')
    date_format = re.compile(r'^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)')
    dateTime1 = date_line_format.search(date_line).group(1)
    dateTime2 = date_line_format.search(date_line).group(2)
    date1_group = date_format.search(dateTime1)
    date2_group = date_format.search(dateTime2)
    # print(dateTime1)
    # print(dateTime2)

    #YEAR1 > YEAR2
    year1 = date1_group.group(0)
    year2 = date2_group.group(0)
    if year1 > year2:
        return False
    if year1 < year2:
        return True
    #MONTH1 > MONTH2
    month1 = date1_group.group(1)
    month2 = date2_group.group(1)
    if month1 > month2:
        return False
    if month1 < month2:
        return True
    #DAY > DAY2
    day1 = date1_group.group(2)
    day2 = date2_group.group(2)
    if day1 > day2:
        return False
    if day1 < day2:
        return True
    #HOUR1 > HOUR2
    hour1 = date1_group.group(3)
    hour2 = date2_group.group(3)
    if hour1 > hour2:
        return False
    if hour1 < hour2:
        return True
    #MIN1 >MIN2
    min1 = date1_group.group(4)
    min2 = date2_group.group(4)
    if min1 > min2:
        return False
    if min1 < min2:
        return True
    #SEC1 >SEC2
    sec1 = date1_group.group(5)
    sec2 = date2_group.group(5)
    if sec1 > sec2: 
        return False
    if sec1 < sec2:
        return True
    return True

#swap disordered dates
#input data of format:
#^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx) to (\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$
def swap_date(date_line):
    date_line_format = re.compile('^([^ ]*) to (.*)$')
    dateTime1 = date_line_format.search(date_line).group(1)
    dateTime2 = date_line_format.search(date_line).group(2)

    correct_date = dateTime2 + " to " + dateTime1
    
    return correct_date

# two dates are of format
# ^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)
# check date 1 is before date2
def is_before(date1, date2):
    date_line = date1 + " to " + date2
    
    return check_date(date_line)


# two dates are of format, respective
# date of publication:^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$
# start date:^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$
def align_date(pub_date, date_line):
    
    date_format = re.compile(r'^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)')
    date_line_group = date_format.search(date_line)
    pub_date_group = date_format.search(pub_date)

    year = pub_date_group.group(1)
    month = pub_date_group.group(2)
    day = pub_date_group.group(3)
    hour = pub_date_group.group(4)
    minute = pub_date_group.group(5)
    second = pub_date_group.group(6)

    if month == 'xx':
        month = date_line_group.group(2)
    if day == 'xx':
        day = date_line_group.group(3)
    if hour == 'xx':
        hour = date_line_group.group(4)
    if minute == 'xx':
        minute = date_line_group.group(5)
    if second == 'xx':
        second = date_line_group.group(6)
    
    final_date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second 

    return final_date
#for testing
# def main():
#     # result = check_date('2019-01-01T12:00:00 to 2019-01-01T13:00:00')
#     # print(result)
#     # date = swap_date('2019-01-01T12:00:00 to 2018-01-01T13:00:00')
#     # print(date)
#     # result1 = is_before("2020-01-01T12:00:00", "2019-01-02T12:00:00")
#     # print(result1)
#     # result = align_date('2019-xx-xxTxx:10:xx', '2018-10-13T12:23:15')
#     # print(result)
# if __name__ == '__main__':
#     main()