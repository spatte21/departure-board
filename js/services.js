angular.module('departuresApp').factory('ReleaseSvc', function() {

    var data = [
        {
            version: '5.0',
            events: [
                {
                    type: 'Development',
                    starts: '2014-07-02',
                    ends: '2014-08-05'
                },
                {
                    type: 'Regression',
                    starts: '2014-08-06',
                    ends: '2014-08-22'
                },
                {
                    type: 'External Release',
                    starts: '2014-08-26'
                },
                {
                    type: 'Hosted Upgrade',
                    starts: '2014-09-02'
                }
            ]
        },
        {
            version: '5.1',
            events: [
                {
                    type: 'Development',
                    starts: '2014-08-06',
                    ends: '2014-09-02'
                },
                {
                    type: 'Regression',
                    starts: '2014-09-03',
                    ends: '2014-09-10'
                },
                {
                    type: 'External Release',
                    starts: '2014-09-11'
                },
                {
                    type: 'Hosted Upgrade',
                    starts: '2014-10-07'
                }
            ]
        }
    ];

    return {
        all: function() {

            var events = [];

            // Flatten the data into a simple array
            _.map(data, function(release) {
                events = _.union(events, _.map(release.events, function(releaseEvent) {
                    return {
                        version: release.version,
                        eventType: releaseEvent.type,
                        starts: releaseEvent.starts,
                        ends: releaseEvent.ends,
                        exceptionStatus: releaseEvent.exceptionStatus
                    };
                }));
            });

            // Translate event record for display on departure board
            events = _.map(events, function(record) {

                var translated = {
                    version: record.version,
                    destination: record.eventType
                };

                var starts = moment(record.starts),
                    today = moment();
                if (record.ends !== undefined) {
                    var ends = moment(record.ends);
                };

                switch (record.eventType) {

                    case 'Development':
                    case 'Regression':

                        if (starts.isAfter(today, 'day')) {
                            translated.status = 'Scheduled';
                            translated.information = 'Gate opens ' + ends.fromNow();
                            translated.time = starts.format('ddd Do MMM');
                        }
                        else if (starts.isBefore(today, 'second')) {
                            if (ends.isBefore(today, 'second')) {
                                translated.status = 'Departed';
                                translated.time = ends.format('ddd Do MMM');
                            }
                            else {
                                if (ends.isAfter(today, 'day')) {
                                    translated.status = 'Boarding';
                                }
                                else if (starts.isSame(today, 'day')) {
                                    translated.status = 'Final Call';
                                }
                                translated.information = 'Gate closing ' + ends.fromNow();
                                translated.time = ends.format('ddd Do MMM');
                            }
                        }

                        break;

                    case "External Release":
                    case "Hosted Upgrade":

                        if (starts.isAfter(today, 'day')) {
                            translated.status = 'Scheduled';
                            translated.time = starts.format('ddd Do MMM');
                        }
                        else if (starts.isSame(today, 'day')) {
                            translated.status = 'Final Call';
                            translated.time = starts.format('ddd Do MMM');
                        }
                        else if (starts.isBefore(today, 'second')) {
                            translated.status = 'Departed';
                            translated.information = 'Gate closed ' + ends.fromNow();
                            translated.time = ends.format('ddd Do MMM');
                        }

                        break;
                };

                return translated;
            })

            return events;
        }
    };

});
