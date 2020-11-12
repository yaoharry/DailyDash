import React, { useEffect } from "react";

import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, TextInput, Alert, ScrollView } from "react-native";
import { Button, Header, Screen, Text, StGoal } from "../../components";
// import { useNavigation } from "@react-navigation/native"
import { StGoalForm, useStores } from "../../models";
import { color, spacing, typography } from "../../theme";
import HideWithKeyboard from "react-native-hide-with-keyboard";
import { getDay } from "../../utils/getDay";


const borderColor = "#737373";

const styles = StyleSheet.create({
  button: {
    marginBottom: 110
  },
  content: {
    alignItems: "center"
  },
  image: {
    height: 50,
    width: 50,
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },
  sideByside: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    fontSize: 15,
    height: 40
  }
});

const ROOT: ViewStyle = {
  backgroundColor: color.palette.white,
  flex: 1,
  alignItems: "center",
  // justifyContent: "center",
};

const Separator = () => (
  <View style={styles.separator} />
);

const TEXT: TextStyle = {
  color: color.palette.black,
  fontFamily: typography.primary,
};
// const BOLD: TextStyle = { fontWeight: "bold" };

const HEADER: TextStyle = {
  paddingTop: spacing[3],
  paddingBottom: spacing[4] + spacing[1],
  paddingHorizontal: 0,
};

const TITLE_WRAPPER: TextStyle = {
  ...TEXT,
  textAlign: "center",
  marginTop: spacing[5],
};
const TITLE: TextStyle = {
  ...TEXT,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const TITLE2: TextStyle = {
  ...TEXT,
  fontSize: 15,
  lineHeight: 30,
  textAlign: "center",
  marginTop: spacing[1],
  marginLeft: spacing[3],
  marginRight: spacing[3],
};

const FULL: ViewStyle = {
  flex: 1
};

export const AddGoalScreen = observer(function AddGoalScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  // OR
  // const rootStore = useStores()

  // Pull in navigation via hook
  const { LtGoalFormStore, goalsStore, dailyGoalStore } = useStores();

  function convertTimeToMin(hr: number, min: number) {
    return (hr * 60) + min;
  }

  function convertSTgoals(fromForm: Array<StGoalForm>) {
    const myStGoal = [];
    for (const goal of fromForm) {
      const time = [convertTimeToMin(parseInt(goal.hour), parseInt(goal.minute))];
      myStGoal.push({
        title: goal.title,
        [goal.day]: time,
      });
    }
    // console.log(myStGoal)
    return myStGoal;
  }

  const navigation = useNavigation();
  // const nextScreen = () => navigation.navigate("primaryStack.home")

  function submitForm(LTgoal: string, description: string, fromForm: Array<StGoalForm>) {
    const myStGoal = convertSTgoals(fromForm);
    goalsStore.postLTgoal(LTgoal, description, myStGoal).then(res => {
      goalsStore.getAllGoals();
      dailyGoalStore.getGoalsForDay(getDay(true));
    });
    LtGoalFormStore.clearForm();
    navigation.navigate("allGoals");
    return 1;
  }

  async function getSuggestion() {
    console.log(LtGoalFormStore.title);
    await goalsStore.getSTsuggestion(LtGoalFormStore.title);
    Alert.alert(goalsStore.STsuggestion);
    return 1;
  }

  const { STgoalForm } = LtGoalFormStore;

  useEffect(() => {
    if (LtGoalFormStore.STgoalForm.length === 0) LtGoalFormStore.addSTgoal();
  }, []);

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE} text="[   Add New Goal   ]" />
        </Text>
        < Separator />
        < Separator />
        <Image source={require("../../../assets/compass.png")} style={styles.image} />
        < Separator />
        < Separator />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="My goal is to .. " />
            <TextInput
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setTitle(text)}
              placeholder="be a happier person."
              maxLength={50}
            />
          </View>
          <View style={styles.sideByside}>
            <Text style={TITLE2} text="Description:" />
            <TextInput
              style={styles.textInput}
              onChangeText={text => LtGoalFormStore.setDescription(text)}
              placeholder="(Optional) I do better when I'm happy."
              maxLength={100}
            />
          </View>
          <Text style={TITLE2} text="Regular Habits: " />
          {STgoalForm.map((goal, index) => (< StGoal myGoal={goal} key={index} />))}
          < Separator />
          <Button
            style={{ ...styles.button}}
            text="Add New Habit"
            onPress={() => LtGoalFormStore.addSTgoal()} />
        </ScrollView>
        <HideWithKeyboard>
          <Button
            text="Get Suggestion"
            onPress={() => getSuggestion()} />
          <Button
            text="Submit"
            onPress={() => submitForm(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} />
        </HideWithKeyboard>
        {/* // onPress={() => goalsStore.postLTgoal(LtGoalFormStore.title, LtGoalFormStore.description, LtGoalFormStore.STgoalForm)} /> */}
        {/* BUTTON TO ADD ANOTHER FIELD, CHANGE REDIRECT SCREEN */}
      </Screen>
    </View>
  );
});
