import React, {useState} from "react";
import {View} from "react-native";
import ScrollabeHeader from "../../../common/components/ScrollabeHeader";
import exImage from "@balletworkout/assets/images/goal-detail-example.png";
import ReviewInfo from "./components/ReviewInfo";
import GoalInformation from "./components/GoalInformation";
import GoalReview from "./components/GoalReview";


interface Props {
    navigation: any
}

const GoalDetailScreen = ({navigation}: Props) => {
    return (
        <ScrollabeHeader navigation={navigation} image={exImage} title={'Daily Full Body Fit'}>
            <View style={{paddingHorizontal: 20}}>
                <ReviewInfo navigation={navigation} />
                <GoalInformation />
                <GoalReview />
            </View>
        </ScrollabeHeader>
    );
}
export default GoalDetailScreen;
