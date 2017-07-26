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
 * @providesModule F8Navigator
 * @flow
 */

'use strict';


/**
 * The components needed from React
 */
import React, {Component} from 'react'
import {
    Text,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    StyleSheet,
    StatusBar,
    Navigator,
    Dimensions
} from 'react-native'


const Platform = require('Platform');
const BackAndroid = require('BackAndroid');
const F8TabsView = require('F8TabsView');
const FilterScreen = require('./filter/FilterScreen');
const LoginModal = require('./components/lib/login/LoginModal');
const RatingScreen = require('./rating/RatingScreen');

const {switchTab} = require('./actions');

const IEADetailedRestaurant = require('./tabs/restaurant/IEADetailedRestaurant')
const IEADetailedEvent = require('./tabs/event/IEADetailedEvent')
const IEAOrderedUser = require('./tabs/orderedUser/IEAOrderedUser')
const IEADetailedRecipe = require('./tabs/recipe/IEADetailedRecipe')

const IEAPhotoBrowserView = require('./components/lib/photosbrowser/IEAPhotoBrowserView')

const IEASearchRestaurants = require('./tabs/search/restaurants/IEASearchRestaurants')
const IEASearchUsers = require('./tabs/search/users/IEASearchUsers')
const IEAEditRestaurant = require('./tabs/edit/restaurant/IEAEditRestaurant')

const {
    MENU_ITEM_ADD_A_RESTAURANT,
    MENU_ITEM_SEARCH_RESTAURANTS,
    MENU_ITEM_MANAGE_FRIENDS,
    MENU_ITEM_READ_REVIEWS
} = require('./lib/constants').default


let F8Navigator = React.createClass({
    _handlers: ([]: Array<() => boolean>),

    componentDidMount: function () {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackButton);
    },

    componentWillUnmount: function () {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackButton);
    },

    getChildContext() {
        return {
            addBackButtonListener: this.addBackButtonListener,
            removeBackButtonListener: this.removeBackButtonListener,
        };
    },

    addBackButtonListener: function (listener) {
        this._handlers.push(listener);
    },

    removeBackButtonListener: function (listener) {
        this._handlers = this._handlers.filter((handler) => handler !== listener);
    },

    handleBackButton: function () {
        for (let i = this._handlers.length - 1; i >= 0; i--) {
            if (this._handlers[i]()) {
                return true;
            }
        }

        const {navigator} = this.refs;
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        }

        if (this.props.tab !== 'main') {
            this.props.dispatch(switchTab('main'));
            return true;
        }
        return false;
    },

    render: function () {
        return (
            <Navigator
                ref="navigator"
                style={styles.container}
                configureScene={(route) => {
                    if (Platform.OS === 'android') {
                        return Navigator.SceneConfigs.FloatFromBottomAndroid;
                    }
                    // TODO: Proper scene support
                    if (route.shareSettings || route.friend) {
                        return Navigator.SceneConfigs.FloatFromRight;
                    } else {
                        return Navigator.SceneConfigs.FloatFromBottom;
                    }
                }}
                initialRoute={{}}
                renderScene={this.renderScene}
            />
        );
    },

    renderScene: function (route, navigator) {
        switch (route.navigatorType) {
            case MENU_ITEM_ADD_A_RESTAURANT: {
                return (<IEAEditRestaurant navigator={navigator}/>)
            }
            case MENU_ITEM_SEARCH_RESTAURANTS: {
                return (<IEASearchRestaurants navigator={navigator}/>)
            }
            case MENU_ITEM_MANAGE_FRIENDS: {
                return (<IEASearchUsers navigator={navigator}/>)
            }
            case MENU_ITEM_READ_REVIEWS: {
                break;
            }
        }

        if (route.filter) {
            return (
                <FilterScreen navigator={navigator}/>
            );
        }
        if (route.login) {
            return (
                <LoginModal
                    navigator={navigator}
                    onLogin={route.callback}
                />
            );
        }
        if (route.rate) {
            return <RatingScreen navigator={navigator} surveys={route.surveys}/>;
        }
        if (route.restaurant) {
            return <IEADetailedRestaurant navigator={navigator}
                                          restaurant={route.restaurant}/>
        }

        if (route.event) {
            return <IEADetailedEvent navigator={navigator}
                                     event={route.event}
                                     forRestaurant={route.forRestaurant}/>
        }

        if (route.orderedUser) {
            return <IEAOrderedUser navigator={navigator}
                                   orderedUser={route.orderedUser}
                                   forRestaurant={route.forRestaurant}
                                   forEvent={route.forEvent}/>
        }

        if (route.recipe) {
            return <IEADetailedRecipe navigator={navigator}
                                      recipe={route.recipe}
                                      forRestaurant={route.forRestaurant}
                                      forEvent={route.forEvent}
                                      forUser={route.forUser}/>
        }


        if (route.photosBrowser) {
            return (<IEAPhotoBrowserView
                navigator={navigator}
                media={route.photosBrowser.media}
                initialIndex={route.photosBrowser.initialIndex}/>)
        }

        return <F8TabsView navigator={navigator}/>;
    },
});

F8Navigator.childContextTypes = {
    addBackButtonListener: React.PropTypes.func,
    removeBackButtonListener: React.PropTypes.func,
};

const {connect} = require('react-redux');

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
});

function select(store) {
    return {
        tab: store.navigation.tab
    };
}

module.exports = connect(select)(F8Navigator);
