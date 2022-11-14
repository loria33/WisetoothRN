import React from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { Colors, fontRatio } from '../../styles/StyleSheet';
import moment from 'moment';
// @ts-ignore
import WhiteTooth from '../../../assets/images/whiteTooth.svg';

const Header = ({ item, title }: any) => (
    <View>
        <StatusBar translucent backgroundColor={Colors.themeColor} barStyle="light-content" />
        <View style={styles.header}>
            <View style={[styles.titleContainer, styles.row]}><Text style={styles.title}>{title}</Text></View>
            <View style={styles.row}>
                <View style={styles.row}>
                    <Text style={styles.text}>{moment(item.date).format('DD/MM/YY')}</Text>
                </View>
                <View style={[styles.row, {
                    marginLeft: 24,
                    marginRight: 24,
                    backgroundColor: Colors.whiteColor,
                    borderRadius: 5,
                    width: 75,
                    height: 26
                }]}>
                    <Text style={[styles.text, styles.blueText]}>{item.serialNum || '--'}</Text>
                </View>
                <View style={styles.row}>
                    <WhiteTooth />
                    <Text style={styles.text}>{(': '+item.toothNum) || '--'}</Text>
                </View>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 14,
    },
    titleContainer: {
        marginBottom: 20,
    },
    title: {
        fontFamily: 'System',
        fontSize: fontRatio(20),
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center',
        color: Colors.whiteColor
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '300',
        fontStyle: 'normal',
        color: Colors.whiteColor,
        textAlign: 'center',
    },
    blueText: {
        color: Colors.blueColor
    },
});

export default Header;
