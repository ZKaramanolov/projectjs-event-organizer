var Manager = {
    eventsList:[],
    usersList:[],
    allowAddingUsersAndEvents:true,

    printEventList:function(listWithEvents = this.eventsList) {
        console.log('----Events----');
        var displayAge;
        for (var i = 0; i < listWithEvents.length; i++) {

            if (!isNaN(listWithEvents[i].date)) {
                var day = listWithEvents[i].date.getDate();
                var month = (listWithEvents[i].date.getMonth() + 1);
                var year = listWithEvents[i].date.getFullYear();
                var date = day + '/' + month + '/' + year;
            } else {
                var date = 'no date';
            }
            if (listWithEvents[i].ageRestriction == false) {
                displayAge = '-'
            } else {
                displayAge = '18+'
            }
            console.log(
                listWithEvents[i].eventName + '\n Age restriction: ' +
                displayAge + ',\n Date: ' +
                date + ',\n Enter fee: ' +
                listWithEvents[i].price + ',\n Generated money: ' +
                listWithEvents[i].generatedMoney + ',\n Rating: ' +
                listWithEvents[i].rating
            );
        }
    },

    printUsersList:function() {
        console.log('----Users----');
        for (var i = 0; i < this.usersList.length; i++) {
            console.log(this.usersList[i].name + ', '
            + this.usersList[i].sex + ', '
            + this.usersList[i].age + ', '
            + this.usersList[i].purse);
        }
    },

    printEventUsers:function(id, sex) {
        var ev = Manager.findEvent(id);
        for (var i = 0; i < ev.users.length; i++) {
            if (ev.users[i][0].sex == sex || sex == undefined) {
                console.log(ev.users[i][0].name + ', ' + ev.users[i][0].sex + ', ' + ev.users[i][0].age);
            }
        }
    },

    printEventWithMostUsers:function() {
        if (this.eventsList.length <= 0) {
            console.error('There is no events');
            return;
        }
        var eventWithMostUsers = [];
        eventWithMostUsers.push(this.eventsList[0]);
        for (var i = 1, k = 0; i < this.eventsList.length; i++) {
            if (this.eventsList[i].users.length > eventWithMostUsers[k].users.length) {
                k = 0;
                eventWithMostUsers = [];
                eventWithMostUsers[k] = this.eventsList[i];
            } else if (this.eventsList[i].users.length == eventWithMostUsers[k].users.length) {
                k++;
                eventWithMostUsers[k] = this.eventsList[i];
            }
        }
        console.log('Event/s with most users is/are: ');
        for (var i = 0; i < eventWithMostUsers.length; i++) {
            console.log('\'' + eventWithMostUsers[i].eventName + '\' with ' + eventWithMostUsers[i].users.length + ' users.');
        }
    },

    printEventsWithoutRestriction:function() {
        for (var i = 0; i < this.eventsList.length; i++) {
            if (this.eventsList[i].ageRestriction == false && !this.eventsList[i].isArchived) {
                console.log(this.eventsList[i].eventName);
            }
        }
    },

    printEventsGroupedByAgeRestriction:function() {
        var withAgeRestriction = [];
        var withoutAgeRestriction = [];

        for (var i = 0; i < this.eventsList.length; i++) {
            var tempEvent = this.eventsList[i];
            var tempName = tempEvent.eventName;
            if (tempEvent.ageRestriction == false) {
                withoutAgeRestriction.push(tempEvent);
            } else {
                withAgeRestriction.push(tempEvent);
            }
        }
        var bothArrays = withAgeRestriction.concat(withoutAgeRestriction)
        console.log('-Event grouped by age restriction-');
        for (var i = 0; i < bothArrays.length; i++) {
            if (bothArrays[i].ageRestriction == false) {
                console.log('# ' + bothArrays[i].eventName + ', -');
            } else {
                console.log('* ' + bothArrays[i].eventName + ', 18+');
            }
        }
    },

    printGeneratedMoneyFromArchivedEvent:function(id) {
        var tempEvent = Manager.findEvent(id);

        if (!tempEvent.isArchived) {
            console.error('Event is not over yet to see generated money!');
            return;
        }

        console.log('Event generated: ' + tempEvent.generatedMoney);
    },

    filterEvents:function(flag, callback) {
        if (typeof flag == 'string') {
            for (var i = 0; i < this.eventsList.length; i++) {
                if (this.eventsList[i].eventName == flag) {
                    callback(this.eventsList[i]);
                }
            }
        }
        if (typeof flag == 'boolean') {
            for (var i = 0; i < this.eventsList.length; i++) {
                if (this.eventsList[i].ageRestriction == flag) {
                    callback(this.eventsList[i]);
                }
            }
        }
    },

    createEventList:function(typeEvent) {
        var sortedEventList = [];

        if (typeEvent == 0) {
            Manager.printEventList();
        } else if (typeEvent == 1) {
            for (var i = 0; i < this.eventsList.length; i++) {
                if (!this.eventsList[i].isArchived) {
                    sortedEventList.push(this.eventsList[i]);
                }
            }
            Manager.printEventList(sortedEventList);
        } else if(typeEvent == 2) {
            for (var i = 0; i < this.eventsList.length; i++) {
                if (this.eventsList[i].isArchived) {
                    sortedEventList.push(this.eventsList[i]);
                }
            }
            Manager.printEventList(sortedEventList);
        }
    },

    addUserToEvent:function(id, user) {
        var tempEvent = Manager.findEvent(id);

        if (tempEvent == undefined) {
            console.error('The event id is incorrect!');
            return;
        }

        var isUserParticipate = Manager.isParticipating(user.id, tempEvent);

        if (tempEvent.isArchived) {
            console.error('Event is archived!');
            return;
        }

        if (!isUserParticipate) {
            if (tempEvent.ageRestriction) {
                if (user.age < 18) {
                    console.error('User is under 18!');
                    return;
                }
            }
            if (user.purse < tempEvent.price && user.vip != 5) {
                console.error('User don\'t have enough money in purse!');
                return;
            }
        } else {
            console.error('User already participate!');
            return;
        }

        if (user.vip == 5) {
            user.vip = 0;
        } else {
            user.purse -= tempEvent.price;
            tempEvent.generatedMoney += tempEvent.price;
            user.vip++;
        }
        var userAndRating = [];
        userAndRating.push(user);
        tempEvent.users.push(userAndRating);
        console.log('User ' + user.name + ' join successfully in ' + tempEvent.eventName + '.');
    },

    editEventName:function(id, newEventName) {
        var tempEvent = Manager.findEvent(id);
        var name;

        if (tempEvent.isArchived) {
            console.error('The event is archived!');
        }

        if (id == undefined || newEventName == undefined) {
            console.error('ID and/or Name cannot be empty!');
            return;
        }

        if (tempEvent.price > 0) {
            name = '$ ' + newEventName;
        } else {
            name = '! ' + newEventName;
        }

        tempEvent.eventName = name;
        console.log('Name was chenged to \'' + name + '\'');
    },

    editEventAgeRestriction:function(id, newAgeRestriction) {
        var tempEvent = Manager.findEvent(id);

        if (tempEvent.isArchived) {
            console.error('The event is archived!');
            return;
        }

        if (id == undefined || typeof newAgeRestriction !== 'boolean') {
            console.error('ID and/or age restrictin cannot be empty!');
            return;
        }

        if (newAgeRestriction) {
            for (var i = 0; i < tempEvent.users.length; i++) {
                if (tempEvent.users[i][0].age < 18) {
                    console.error('There are users under 18 and can not change age restriction to \'18+\'');
                }
            }
        }

        tempEvent.ageRestriction = newAgeRestriction;
        console.log('Age restriction was chenged to \'' + newAgeRestriction + '\'');
    },

    rateEvent:function(id, user, userRating) {
        var tempEvent = Manager.findEvent(id);

        if (userRating < 1 || userRating > 10) {
            console.error('User rating is incorrect!');
            return;
        }

        if (!Manager.isParticipating(user.id, tempEvent)) {
            console.error('User does not participate in this event!');
            return;
        }

        if (!tempEvent.isArchived) {
            console.error('Event is not archived!');
            return;
        }

        var scaledUserRating = Math.round((userRating * 0.66666 - 0.66666) * 100) / 100;
        var userIndex;
        for (var i = 0; i < tempEvent.users.length; i++) {
            if (tempEvent.users[i][0].id == user.id) {
                userIndex = i;
            }
        }

        tempEvent.users[userIndex][1] = scaledUserRating;
        var sumEventRating = 0;
        var countOfUserRating = 0;
        for (var i = 0; i < tempEvent.users.length; i++) {
            if (tempEvent.users[i][1] != undefined) {
                sumEventRating += tempEvent.users[i][1];
                countOfUserRating++;
            }
        }
        tempEvent.rating = Math.round((sumEventRating / countOfUserRating) * 100) / 100;
    },

    removeEvent:function(id) {
        var tempEvent = Manager.findEvent(id);

        if (tempEvent.isArchived) {
            console.error('The event is archived!');
            return;
        }

        console.log('Event \'' + tempEvent.eventName + '\' was removed!');
        this.eventsList.splice(tempEvent.id-1, 1);
    },

    removeUserFromEvent:function(id, user) {
        var tempEvent = Manager.findEvent(id);

        if (tempEvent.isArchived) {
            console.error('The event is archived!');
            return;
        }

        for (var i = 0; i < tempEvent.users.length; i++) {
            if (tempEvent.users[i][0].id == user.id) {
                tempEvent.users.splice(i, 1);
                console.log('User was removed successfully');
                return;
            }
        }
        console.error('Event id or user was incorrect!');
    },

    findEvent:function(id) {
        for (var i = 0; i < this.eventsList.length; i++) {
            if (id == this.eventsList[i].id) {
                return this.eventsList[i];
            }
        }
    },

    isParticipating:function(id, ev) {
        for (var i = 0; i < ev.users.length; i++) {
            if (id == ev.users[i][0].id) {
                return true;
            }
        }
        return false;
    },

    changeAddingUsersAndEvents:function() {
        if (Manager.allowAddingUsersAndEvents) {
            Manager.allowAddingUsersAndEvents = false;
            console.log('Manager is closed for adding events and users!');
            return;
        }
        Manager.allowAddingUsersAndEvents = true;
        console.log('Manager is open for adding events and users.');
    },

    moveEventToArchive:function(id){
        var tempEvent = Manager.findEvent(id);
        if (!tempEvent.isArchived) {
            tempEvent.isArchived = true;
            var tempName = tempEvent.eventName;
            tempEvent.eventName = '~ ' + tempName;
            console.log('Can not add anymore users to ' + tempEvent.eventName);
            return;
        }
        console.error('Event is already archived!');
    },

    Event:{
        id: 1,
        createEvent:function(eventName) {
            var name;
            var ar = false;
            var d;
            var p = 0;
            if (Manager.allowAddingUsersAndEvents) {

                if (eventName == undefined) {
                    console.error('Name can not be empty!');
                    return;
                }

                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] == 'boolean') {
                        ar = arguments[i];
                    }
                    if (typeof arguments[i] == 'string') {
                        d = arguments[i];
                    }
                    if (typeof arguments[i] == 'number') {
                        p = arguments[i];
                    }
                }

                if (p > 0) {
                    name = '$ ' + eventName;
                } else {
                    name = '! ' + eventName;
                }

                var newEvent = {
                    id: this.id++,
                    eventName:name,
                    ageRestriction:ar,
                    date:new Date(d),
                    users:[],
                    price:p,
                    generatedMoney:0,
                    isArchived:false,
                    rating:'Do not have rating yet'
                };
                Manager.eventsList.push(newEvent);
                return newEvent;
            } else {
                console.error('Can not add event untill manager is closed!');
            }
        }
    },

    User:{
        id:1,
        createUser:function(name, sex, age, purse = 0) {
            if (Manager.allowAddingUsersAndEvents) {
                if (name == undefined || sex == undefined || age == undefined) {
                    console.error('User must have name, sex and age!');
                    return;
                }
                var tempusersList = Manager.usersList;
                var user = {id:this.id++, name:name, sex:sex, age:age, purse:purse, vip:0};
                tempusersList.push(user);
                return user;
            } else {
                console.error('Can not add user untill manager is closed!');
            }
        }
    }
}

//създаваме евенти
var firstEvent = Manager.Event.createEvent('First event', false, '3-28-2018', 10);      //1
var secondEvent = Manager.Event.createEvent('Second event', true, 0);                   //2
var thirdEvent = Manager.Event.createEvent('Third event', '5-1-2019');                  //3
var forthEvent = Manager.Event.createEvent('Fourth event', '2-2-2019', 5);              //4
var fivedEvent = Manager.Event.createEvent('Fived event', true, '11-30-2019', 15);      //5
var sixedEvent = Manager.Event.createEvent('Sixed event', false, '4-22-2019', 10);      //6
var seventhEvent = Manager.Event.createEvent('Seventh event', false, '12-3-2019', 20);  //7

//създаваме потребители
var userOne = Manager.User.createUser('Ivan', 'male', 15, 20);
var userTwo = Manager.User.createUser('Ana', 'female', 18, 300);
var userThree = Manager.User.createUser('Genka', 'female', 22, 41);
var userFour = Manager.User.createUser('Gosho', 'male', 29, 150);
var userFive = Manager.User.createUser('Maria', 'female', 17, 30);
var userSix = Manager.User.createUser('Petur', 'male', 10, 40);

//добавяме потребители в евентите
Manager.addUserToEvent(1, userTwo);
Manager.addUserToEvent(4, userTwo);
Manager.addUserToEvent(6, userTwo);
Manager.addUserToEvent(7, userTwo);

Manager.addUserToEvent(1, userFour);
Manager.addUserToEvent(2, userFour);
Manager.addUserToEvent(5, userFour);
Manager.addUserToEvent(6, userFour);
Manager.addUserToEvent(7, userFour);

Manager.addUserToEvent(6, userFive);
Manager.addUserToEvent(7, userFive);

Manager.addUserToEvent(1, userSix);
Manager.addUserToEvent(6, userSix);
Manager.addUserToEvent(7, userSix);

console.log('------Задачи------');

//Основни задачи - 1
//Евентите се съхраняват в списък, а самите евенти са обекти
console.log(Manager.eventsList)

//Основни задачи - 2
//функцията принтира глобалния списък с евенти(eventsList), но може да се подаде и друг списък с евенти
Manager.printEventList();

//Основни задачи - 3
//изтрива евент по неговото id
Manager.removeEvent(2);

//Основни задачи - 4
//createEvent приема string за име и всички останали параметри се преглеждат от arguments
//age restriction - boolean
//price(entry fee) - number
//date of event - string
Manager.Event.createEvent('Asdf', false, 21);

//Основни задачи - 5
Manager.editEventName(8, 'New Asdf');
Manager.editEventAgeRestriction(8, true);

//Основни задачи - 6
//потребителя се включва успешно в евента
Manager.addUserToEvent(1, userOne);
//потребителя е на 15 и не може да се включи в евент за над 18
Manager.addUserToEvent(5, userOne);

//Основни задачи - 7
//printEventUsers приема id на евента, за 2-ри параметър може да приеме 'male'/'female' за филтрация по пол
Manager.printEventUsers(1);

//Основни задачи - 8
Manager.removeUserFromEvent(1, userOne);

//Допълнителни задачи 1 - 1
//с първо извикване системата се заключва за добавянето на потребители и евенти
Manager.changeAddingUsersAndEvents();
//с второ извикване системата се отключва
Manager.changeAddingUsersAndEvents();

//Допълнителни задачи 1 - 2
//датата се подава като string във формат month/day/year и се записват в обект Data
Manager.Event.createEvent('Asdf - 2', '4/20/2019');

//Допълнителни задачи 1 - 3
//функцията връща евента/евентите с най-много потребители, като показва името и броя потребители
Manager.printEventWithMostUsers();

//Допълнителни задачи 1 - 4
console.log('-Events without age restriction-');
Manager.printEventsWithoutRestriction();

//Допълнителни задачи 1 - 5
Manager.printEventsGroupedByAgeRestriction();

//Допълнителни задачи 1 - 6
//първия парамаетър може да е стринг(търсене по име) или boolean(за търсене по възрастово ограничение)
//втория параметър е функция(callback), която потребителя казва как да се принтират елемените
Manager.filterEvents('New Asdf', function(event) {
    console.log('Callback: ' + event.eventName);
});

//Допълнителни задачи 2 - 1
//Допълнителни задачи 2 - 2
//всички събития входна такса, безплатните са с входна такса 0
Manager.Event.createEvent('Event 2-2', true);

//Допълнителни задачи 2 - 3
//всяко събитие още при създаването си се проверява дали е безплатно или не и се поставя $ или !
Manager.printEventList();

//Допълнителни задачи 2 - 4
//има достатъчно пари да се включи в евента
Manager.addUserToEvent(1, userOne);
//няма достатъчно пари да се включи в евента
Manager.addUserToEvent(7, userOne);

//Допълнителни задачи 2 - 5
//потребителя има 41 пари да плати само за 1, 3, 4, 5 и 6-ти евент, но тъй като е участник на поне 5 евента е VIP
//за това може да се влезне и на 7-я евент
Manager.addUserToEvent(1, userThree); //10 $
Manager.addUserToEvent(3, userThree); //0 $
Manager.addUserToEvent(4, userThree); //5 $
Manager.addUserToEvent(5, userThree); //15 $
Manager.addUserToEvent(6, userThree); //10 $
Manager.addUserToEvent(7, userThree); //20 $

//Допълнителни задачи 3 - 1
//евента е архивиран
Manager.moveEventToArchive(1);
Manager.addUserToEvent(1, userFive);

//Допълнителни задачи 3 - 2
//само първия евент 'First event' започва с ~, защото е единствения архивиран евент
Manager.printEventList();

//Допълнителни задачи 3 - 3
//с 0 принтира всички евенти
Manager.createEventList(0);
//с 1 принтира само активните евенти
Manager.createEventList(1);
//с 2 принтира само архивираните евенти
Manager.createEventList(2);

//Допълнителни задачи 3 - 4
//показва колко пари е събрал един архивиран евент
Manager.printGeneratedMoneyFromArchivedEvent(1);

//Допълнителни задачи 3 - 5
//Допълнителни задачи 3 - 6
//потребител, който участва в евент оценява между 0 и 10
//оценките се приравняват към скалата на евента (0 - 6)
//евент който няма нито една оценка, рейтинга му е 'Do not have rating yet'
Manager.rateEvent(1, userOne, 10);
Manager.rateEvent(1, userFour, 1);
Manager.rateEvent(1, userThree, 7);
