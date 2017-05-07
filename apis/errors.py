from appbase.errors import BaseError


class InvalidDates(BaseError):
    def __init__(self, dates):
        date_items = []
        for kv in dates.items():
            date_items.extend(kv)
        self.msg = 'Invalid dates: {0}: {1}, {2}: {3}'.format(date_items)
        self.data = dates


class DoesNotExist(BaseError):
    def __init__(self):
        self.msg = 'Error: No such object'
