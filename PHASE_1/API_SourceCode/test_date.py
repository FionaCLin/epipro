#!  /usr/local/bin/python3
import date_tool

invalid_date = [
    '2018-11-03Txx:xx:xx to 2018-11-xxTxx:xx:xx',
    '2018-xx-xxTxx:xx:xx to 2017-xx-xxTxx:xx:xx'
]

valid_date = [
    '2019-01-01T12:00:00 to 2019-01-01T13:00:00',
    '2018-xx-xxTxx:xx:xx to 2019-xx-xxTxx:xx:xx',
    '2018-11-01T17:xx:xx to 2018-12-xxTxx:xx:xx'
]

is_before = [
    ["2020-01-01T12:00:00", "2019-01-02T12:00:00"]
]

is_NOT_before = [
    ["2019-01-02T12:00:00", "2020-01-01T12:00:00"]
]


def test_check_date():
    for date_line in invalid_date:
        print(date_tool.check_date(date_line))
        assert False == date_tool.check_date(date_line)

    for date_line in valid_date:
        assert True == date_tool.check_date(date_line)


def test_check_is_before():
    for dates in is_before:
        assert True == date_tool.is_before(dates[0], dates[1])
    for dates in is_NOT_before:
        assert False == date_tool.is_before(dates[0], dates[1])


def test_check_swap_date():
    for dates in is_NOT_before:
        date = date_tool.swap_date('{} to {}'.format(dates[0], dates[1]))
        chk_dates = date.split(' to ')
        assert False == date_tool.is_before(chk_dates[0], chk_dates[1])

print('test_check_date')
test_check_date()
print('test_check_is_before')
test_check_is_before()
print('test_check_swap_date')
test_check_swap_date()
