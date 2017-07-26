/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

'use strict';

const logError = require('logError');
const InteractionManager = require('InteractionManager');

const _ = require('underscore')
import type {Action, ThunkAction} from './types'

const {
    RestaurantService, EventService, PeopleInEventService,
    RecipeService,
    PhotoService, UserServicef
} = require('../parse/realmApi').default
const {getLocalImageUri} = require('../parse/fsApi')

/**
 * The states were interested in
 */
const {
    QUERY_NEAR_RESTAURANTS,
    QUERY_EVENTS_FOR_RESTAURANT,
    QUERY_PHOTOS_FOR_RESTAURANT,
    QUERY_PHOTOS_FOR_RECIPE,
    QUERY_USERS_FOR_EVENT,
    QUERY_RECIPES_FOR_USER,
    PARSE_ORIGINAL_IMAGES,
    PARSE_THUMBNAIL_IMAGES
} = require('../lib/constants').default


async function _queryNearRestaurant(): Promise<Array<Action>> {

    const results = RestaurantService.findAll()//.filtered('displayName == $0', 'LASA')
    for (let i = 0; i < results.length; i++) {
        if (results[i].localPhotoStatus === true) {
            continue
        }
        const imageUri = await getLocalImageUri(results[i].listPhotoId, PARSE_THUMBNAIL_IMAGES)
        if (imageUri !== '') {
            RestaurantService.updateImageUri(results[i], true, function () {
            })
        }
    }

    const action = {
        type: QUERY_NEAR_RESTAURANTS,
        payload: results
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryNearRestaurant(): ThunkAction {
    return (dispatch) => {
        const action = _queryNearRestaurant()

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}


async function _queryPeopleForEvent(eventId: string): Promise<Array<Action>> {
    const results = PeopleInEventService.findAll()
    const json = JSON.stringify(users)

    const ids = _.pluck(results, 'userId')
    const users = UserService.getUsersContainedIn(ids)

    const action = {
        type: QUERY_USERS_FOR_EVENT,
        payload: {
            eventId: eventId,
            results: users
        }
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryPeopleForEvent(eventId: string): ThunkAction {
    return (dispatch) => {
        const action = _queryPeopleForEvent(eventId)

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}


async function _queryEventsForRestaurant(restaurantId: string): Promise<Array<Action>> {
    const results = EventService.findAll().filtered('restaurantId = "' + restaurantId + '"');

    const action = {
        type: QUERY_EVENTS_FOR_RESTAURANT,
        payload: {
            restaurantId: restaurantId,
            results: results
        }
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryEventsForRestaurant(restaurantId: string): ThunkAction {
    return (dispatch) => {
        const action = _queryEventsForRestaurant(restaurantId)

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}


async function _queryPhotosForRestaurant(restaurantId: string): Promise<Array<Action>> {
    const results = PhotoService.findAll().filtered('restaurantId = "' + restaurantId + '"');

    const action = {
        type: QUERY_PHOTOS_FOR_RESTAURANT,
        payload: {
            restaurantId: restaurantId,
            results: results
        }
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryPhotosForRestaurant(restaurantId: string): ThunkAction {
    return (dispatch) => {
        const action = _queryPhotosForRestaurant(restaurantId)

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}


async function _queryPhotosForRecipe(recipeId: string): Promise<Array<Action>> {
    const results = PhotoService.findAll().filtered('recipeId = "' + recipeId + '"');

    const action = {
        type: QUERY_PHOTOS_FOR_RECIPE,
        payload: {
            recipeId: recipeId,
            results: results
        }
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryPhotosForRecipe(recipeId: string): ThunkAction {
    return (dispatch) => {
        const action = _queryPhotosForRecipe(recipeId)

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}


async function _queryRecipesForUser(restaurantId: string, eventId: string, userId: string): Promise<Array<Action>> {
    // const results = RecipeService.findAll().filtered('restaurantId = "' + restaurantId + '"');
    const results = RecipeService.findAll().slice(0, 5);

    const action = {
        type: QUERY_RECIPES_FOR_USER,
        payload: {
            restaurantId: restaurantId,
            eventId: eventId,
            userId: userId,
            results: results
        }
    }
    return Promise.all([
        Promise.resolve(action)
    ])
}

function queryRecipesForUser(restaurantId: string, eventId: string, userId: string): ThunkAction {
    return (dispatch) => {
        const action = _queryRecipesForUser(restaurantId, eventId, userId)

        // Loading friends schedules shouldn't block the login process
        action.then(
            ([result]) => {
                dispatch(result)
            }
        )
        return action
    }
}

export default {
    queryNearRestaurant,
    queryEventsForRestaurant,
    queryPeopleForEvent,
    queryPhotosForRestaurant,
    queryRecipesForUser,
    queryPhotosForRecipe,
}
