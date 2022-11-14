import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryScatter } from "victory-native";
import { Colors, fontRatio } from '../../styles/StyleSheet';
// @ts-ignore
import Rect from '../../../assets/images/rect.svg';
import moment from 'moment';

const deviceWidth = Dimensions.get('window').width;
const chartPadding = {
    right: 10,
    left: 40,
    bottom: 30,
    top: 30,
};
const strokeWidth = 2;

const AreaChart = ({ data, scatterData, total }: any) => (
    <View>
        <Text style={[styles.tickLabels, { textAlign: 'left', paddingLeft: '20%', paddingTop: 10}]}>{moment().year()}</Text>
        <View style={{
            borderTopWidth: strokeWidth,
            borderColor: Colors.themeColor,
            borderStyle: 'solid',
            top: chartPadding.top + 3,
            right: deviceWidth - chartPadding.left
        }} />
        <View style={{
            borderTopWidth: strokeWidth,
            borderColor: Colors.themeColor,
            borderStyle: 'solid',
            top: chartPadding.top + 1.5,
            left: deviceWidth - chartPadding.right
        }} />
        <VictoryChart
            width={deviceWidth}
            height={200}
            padding={{
                top: chartPadding.top,
                bottom: chartPadding.bottom,
                right: chartPadding.right,
                left: chartPadding.left
            }}
        >
            <VictoryAxis
                orientation="top"
                style={{
                    axis: { stroke: Colors.themeColor, strokeWidth: strokeWidth },
                    ticks: { stroke: Colors.themeColor, size: 4 },
                    tickLabels: styles.tickLabels
                }}

            />
            <VictoryAxis
                orientation="left"
                dependentAxis
                tickFormat={(y) => -y + (total.toString().length >= 4 ? 'k' : '')}
                style={{
                    axis: { stroke: Colors.themeColor, strokeWidth: 2 },
                    grid: { stroke: "rgba(43, 143, 255, 0.2)" },
                    tickLabels: styles.tickLabels
                }}
                domain={[-1, -2]}
            />
            <VictoryArea
                interpolation="natural"
                data={data}
                style={{
                    data: {
                        fill: 'rgba(43, 143, 255, 0.2)',
                        stroke: Colors.themeColor,
                        strokeWidth: 1
                    },
                }}
            />
            <VictoryScatter
                style={{ data: { fill: Colors.themeColor } }}
                size={4}
                data={scatterData}
            />
        </VictoryChart>
        <View style={{ bottom: chartPadding.bottom, left: chartPadding.left - 5 }}><Rect /></View>
    </View>

);


const styles = StyleSheet.create({
    tickLabels: {
        fontSize: fontRatio(10),
        paddingRight: 5,
        color: Colors.blueColor,
        opacity: 0.6,
        fontFamily: 'System',
        fontWeight: '300',
        fontStyle: 'normal',
        textAlign: 'center',
    }
});
export default AreaChart;
