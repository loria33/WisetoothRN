import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { Colors, fontRatio } from '../../styles/StyleSheet';
import AppHeader from '../../components/Header'
import I18n from '../../l18n/I18n';
// @ts-ignore
import Filter from '../../../assets/images/filter.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Header = ({
    title,
    name,
    navigation,
    toggleSelection,
    isSuccessSelected,
    isToHideTitle,
    navigateToStatisticsFilterView
}: any) => (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor={Colors.themeColor} barStyle="light-content" />
            <AppHeader title={title} navigation={navigation} color={Colors.whiteColor}  style={{height: 'auto'}}/>
            <View style={styles.header}>
                {!isToHideTitle &&
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {I18n.t('welcomeMsg') + (name ? 'Dr.' + name : '') + '\n' + I18n.t('statisticsHeader')}
                        </Text>
                    </View>
                }
                <View style={styles.btnWrapper}>
                    <View style={styles.btnContainer}>
                    <TouchableOpacity style={[styles.btn, {
                            marginRight: 0,
                            backgroundColor: isSuccessSelected ?
                                'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255,0.7)'
                        }]}
                            onPress={() => toggleSelection(true)}
                        >
                            <Text style={[styles.text, {
                                opacity: isSuccessSelected ? 1 : 0.5,
                                color: isSuccessSelected ? Colors.themeColor : Colors.blueColor
                            }]}>{I18n.t('success')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, {
                            backgroundColor: !isSuccessSelected ?
                                'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255,0.7)',
                            marginLeft: 0,
                        }]}
                            onPress={() => toggleSelection(false)}
                        >
                            <Text style={[styles.text, {
                                opacity: !isSuccessSelected ? 1 : 0.5,
                                color: !isSuccessSelected ? Colors.themeColor : Colors.blueColor
                            }]}>{I18n.t('failures')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={navigateToStatisticsFilterView}>
                        <Filter />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.themeColor,
        flexDirection: "column",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    header: {
        flexDirection: 'column',
        marginTop: 10,
        alignItems: 'flex-start',
        paddingLeft: 14,
        marginBottom: 8,
    },
    titleContainer: {
        marginBottom: 18,
    },
    title: {
        fontFamily: 'System',
        fontSize: fontRatio(15),
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        color: Colors.whiteColor,
        textTransform: 'capitalize',
        lineHeight: 17,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'System',
        fontSize: 12,
        fontWeight: 'bold',
        fontStyle: 'normal',
        color: Colors.blueColor,
        textAlign: 'center',
    },
    btnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    btnContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        width: 160,
        marginBottom: 10,
    },
    btn: {
        height: 29,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        backgroundColor: Colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        borderRadius: 10
    }
});

export default Header;
