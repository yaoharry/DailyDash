import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, SectionList, SafeAreaView } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";
import { Goal, useStores } from "../../models";
import { getDay } from "../../utils/getDay";

const borderColor = "#737373";
const white = "#fff";
const black = "#000";
const lightseagreen = "#616F6C"; 
const almostBlack = "#00231C";

const styles = StyleSheet.create({
  black: {
    color: almostBlack
  },
  description: {
    color: lightseagreen,
    fontStyle: "italic", 
    fontSize: 17
  },
  button: {
    marginLeft: 10,
    marginRight: 10, 
    backgroundColor: "#008080",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonText: {
    fontSize: 15, 
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1
  },
  header: {
    textAlign:"center",
    backgroundColor: "#46BFAC",
    flex: 1,
    fontSize: 32, 
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10, 
  },
  image: {
    height: 75,
    width: 75,
  },
  item: {
    backgroundColor: white,
    flexDirection: "row",
    flex: 1,
    marginVertical: 8,
    padding: 20
  },
  right: {
    color: black,
    flex: 1,
    textAlign: "right"
  },
  sectionList: {
    flex: 1,
    width: 350, 
  },
  separator: {
    borderBottomColor: borderColor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 8,
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
const BOLD: TextStyle = { fontWeight: "bold" };

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
  ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
};

const FULL: ViewStyle = {
  flex: 1
};

export const CommonGoalDetailScreen = observer(function CommonGoalDetailScreen() {
  const { goalsStore, dailyGoalStore } = useStores();

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as Goal;
  const myGoal: Goal =  goalsStore.listOfGoals.filter(goal => goal.id == id)[0]
  const {LTgoal, description, STgoals} = myGoal

  function addThisGoal() {

    goalsStore.postLTgoal(LTgoal, description, STgoals).then(res => {
      goalsStore.getAllGoals();
      dailyGoalStore.getGoalsForDay(getDay(true));
    });

    navigation.navigate("allGoals");
  }

  const allSTGoals = [];
  const monday = [];
  const tuesday = [];
  const wednesday = [];
  const thursday = [];
  const friday = [];
  const saturday = [];
  const sunday = [];

  for (const goal of STgoals) {
    if (goal.mon.length > 0) monday.push([goal.mon[0], goal.title, goal.id, "Monday"]);
    if (goal.tue.length > 0) tuesday.push([goal.tue[0], goal.title, goal.id, "Tuesday"]);
    if (goal.wed.length > 0) wednesday.push([goal.wed[0], goal.title, goal.id, "Wednesday"]);
    if (goal.thu.length > 0) thursday.push([goal.thu[0], goal.title,, goal.id, "Thursday"]);
    if (goal.fri.length > 0) friday.push([goal.fri[0], goal.title, goal.id], "Friday");
    if (goal.sat.length > 0) saturday.push([goal.sat[0], goal.title, goal.id, "Saturday"]);
    if (goal.sun.length > 0) sunday.push([goal.sun[0], goal.title, goal.id, "Sunday"]);
  }

  if (monday.length > 0) allSTGoals.push({
    title: monday[0][3],
    data: monday.sort(sortFunction)
  })
  if (tuesday.length > 0) allSTGoals.push({
    title: tuesday[0][3],
    data: tuesday.sort(sortFunction)
  })
  if (wednesday.length > 0) allSTGoals.push({
    title: wednesday[0][3],
    data: wednesday.sort(sortFunction)
  })
  if (thursday.length > 0) allSTGoals.push({
    title: thursday[0][3],
    data: thursday.sort(sortFunction)
  })
  if (friday.length > 0) allSTGoals.push({
    title: friday[0][3],
    data: friday.sort(sortFunction)
  })
  if (saturday.length > 0) allSTGoals.push({
    title: saturday[0][3],
    data: saturday.sort(sortFunction)
  })
  if (sunday.length > 0) allSTGoals.push({
    title: sunday[0][3],
    data: sunday.sort(sortFunction)
  })

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  const Item = ({ title }) => {
    let minsStr = "";

    const mins = title[0] % 60;
    if (Math.floor(mins / 10) === 0) {
      minsStr = "0" + mins.toString();
    } else {
      minsStr = mins.toString();
    }
    const hrs = (Math.floor(title[0] / 60)).toString();
    return (
      <View style={styles.item}>
        <Text style={styles.black}>{title[1]}</Text>
        <Text style={styles.right}>{hrs}:{minsStr}</Text>
      </View>
    );
  };

  return (
    <View style={FULL}>
      <Screen style={ROOT} backgroundColor={color.transparent}>
        <Header style={HEADER} />
        <Text style={TITLE_WRAPPER}>
          <Text style={TITLE}>{LTgoal}</Text>
        </Text>
        < Separator />
        <Image source={require("../../../assets/boot.png")} style={styles.image} />
        < Separator />
        <Text style={styles.description}> {description} </Text>
        < Separator />
        <SafeAreaView style={styles.flex}>
          <SectionList
            style={styles.sectionList}
            sections={allSTGoals}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </SafeAreaView>
        <Button
          testID="addCommonGoalButton"
          style={styles.button}
          text="ADD GOAL"
          textStyle={styles.buttonText}
          onPress={() => addThisGoal()}
        />
      </Screen>
    </View>
  );
});