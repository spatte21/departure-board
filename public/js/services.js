angular.module('departures').value('coralReefUrl', "http://coral-reef.azurewebsites.net");

angular.module('departures').factory('releaseSvc', function(coralReefUrl, $resource, $q, $window) {

    function transformEventData(events) {
        // Translate event record for display on departure board
        events = _.map(events, function(record) {

            var translated = {
                version: record.releaseId,
                destination: record.type
            };

            var starts = moment(record.starts),
                ends = moment(record.ends),
                today = moment();

            switch (record.type) {

                case 'Development':
                case 'Regression':

                    if (starts.isAfter(today, 'day')) {
                        translated.status = 'Scheduled';
                        translated.information = 'Gate opens ' + starts.fromNow();
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
                            else {
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
                        translated.information = 'Gate closed ' + starts.fromNow();
                        translated.time = starts.format('ddd Do MMM');
                    }

                    break;
            };

            return translated;
        })

        return events;
    }

    return {
        all: function() {

            var defer = $q.defer();
            var events = [];
            var shush = $window.shush;

            $resource(coralReefUrl + '/releaseEvent?shush=' + shush).query(function(data) {
                events = data;
                defer.resolve(transformEventData(events));
            });

            return defer.promise;
        }
    };

});
