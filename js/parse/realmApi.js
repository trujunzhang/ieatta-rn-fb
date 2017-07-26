'use strict'

const repository = require('../parse/realmObjects').default
console.log(repository.path)

const Records = require('../lib/records').default

/**
 * The states were interested in
 */
const {
    PARSE_CONFIGURE,
    PARSE_RESTAURANTS,
    PARSE_USERS,
    PARSE_RECORDS,
    PARSE_EVENTS,
    PARSE_PEOPLE_IN_EVENTS,
    PARSE_RECIPES,
    PARSE_PHOTOS,
    PARSE_REVIEWS,
} = require('../lib/constants').default


function writeParseRecord(record) {
    // debugger
    const object = record[record.recordType]
    const {parseObject, realmSchema} = Records.realmObjects[record.recordType]

    if (repository.objects(parseObject).filtered('objectId == $0', object.id).length) return // Exist

    repository.write(() => {
        repository.create(parseObject, Records.getRealmData(parseObject, object))
    })
}

const ConfigureService = {
    getLastRecordUpdatedAt: function () {
        let array = repository.objects(PARSE_CONFIGURE)
        if (array.length) {
            return array[0].lastRecordUpdatedAt
        }

        return null
    },

    saveLastRecordUpdatedAt: function (recorderUpdatedAt) {
        let array = repository.objects(PARSE_CONFIGURE)
        if (array.length) {// update
            repository.write(() => {
                array[0].lastRecordUpdatedAt = recorderUpdatedAt;
            })
        } else {// new configure, then create it.
            repository.write(() => {
                repository.create(PARSE_CONFIGURE, {
                    objectId: 'c001',
                    lastRecordUpdatedAt: recorderUpdatedAt
                })
            })
        }

        return null
    }
}

const RestaurantService = {
    findByTerm: function (term) {
        let objects = repository.objects(PARSE_RESTAURANTS)
        if (!!term.location) {

        }
        if (!!term.search) {
            objects = objects.filtered('displayName CONTAINS[c] $0 OR address CONTAINS[c] $0', term.search)
            const length = objects.length;
            // debugger
        }
        return objects;
    },

    save: function (item) {
        if (repository.objects(PARSE_RESTAURANTS).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_RESTAURANTS, Records.getRealmData(PARSE_RESTAURANTS, item))
        })
    },

    updateImageUri: function (item, localPhotoStatus, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.localPhotoStatus = localPhotoStatus;
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}

const EventService = {
    findAll: function (sortBy) {
        return repository.objects(PARSE_EVENTS)
    },

    save: function (item) {
        if (repository.objects(PARSE_EVENTS).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_EVENTS, Records.getRealmData(PARSE_EVENTS, item))
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}


const PeopleInEventService = {
    findAll: function (sortBy) {
        return repository.objects(PARSE_PEOPLE_IN_EVENTS)
    },

    save: function (item) {
        if (repository.objects(PARSE_PEOPLE_IN_EVENTS).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_PEOPLE_IN_EVENTS, Records.getRealmData(PARSE_PEOPLE_IN_EVENTS, item))
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}


const PhotoService = {
    findAll: function (sortBy) {
        return repository.objects(PARSE_PHOTOS)
    },

    save: function (item) {
        if (repository.objects(PARSE_PHOTOS).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_PHOTOS, Records.getRealmData(PARSE_PHOTOS, item))
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}


const RecipeService = {
    findAll: function () {
        return repository.objects(PARSE_RECIPES)
    },

    save: function (item) {
        if (repository.objects(PARSE_RECIPES).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_RECIPES, Records.getRealmData(PARSE_RECIPES, item))
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}


const UserService = {
    findByTerm: function (term) {
        let objects = repository.objects(PARSE_USERS)
        if (!!term.search) {
            objects = objects.filtered('displayName CONTAINS[c] $0', term.search)
            const length = objects.length;
            debugger
        }
        return objects;
    },

    /**
     * Ref: https://github.com/realm/realm-js/issues/450
     * Here is a code snippet that should generate the query you want to run:
     *
     * var filtered = sample.filtered([2,4,7,10].map((id) => 'id == ' + id).join(' OR '));
     *
     * This should create a query of the form id == 2 OR id == 4 OR id == 7 OR id ==10.
     * Once we support IN queries it will do this for you internally.
     * @param ids
     * @returns {Results<T>}
     */
    getUsersContainedIn: function (ids) {
        const query = (ids.map((id) => {
            return `objectId == '${id}'`
        })).join(' OR ')

        return repository.objects(PARSE_USERS).filtered(query);
    },

    save: function (item) {
        if (repository.objects(PARSE_USERS).filtered('objectId == $0', item.id).length) return;
        repository.write(() => {
            repository.create(PARSE_USERS, Records.getRealmData(PARSE_USERS, item))
        })
    },

    update: function (item, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            item.updatedAt = new Date();
        })
    }
}

export default {
    writeParseRecord,
    ConfigureService,
    RestaurantService,
    EventService,
    PeopleInEventService,
    PhotoService,
    UserService,
    RecipeService
}