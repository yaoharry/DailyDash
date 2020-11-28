import React from "react";
import { observer } from "mobx-react-lite";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, TextStyle, Image, ViewStyle, View, SectionList, SafeAreaView, Dimensions } from "react-native";
import { Button, Header, Screen, Text } from "../../components";
import { color, spacing, typography } from "../../theme";
import { Goal, useStores } from "../../models";
import { getDay } from "../../utils/getDay";
import { getDisplayTime } from "../../utils/getDisplayTime";

const borderColor = "#737373";
const white = "#fff";
const black = "#000";
const lightseagreen = "#616F6C";
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  black: {
    color: black
  },
  button: {
    backgroundColor: "#008080",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 15,
  },
  description: {
    color: lightseagreen,
    fontSize: 17,
    fontStyle: "italic",
    width: windowWidth-24,
    textAlign: 'center'
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flex: {
    flex: 1
  },
  header: {
    backgroundColor: "#46BFAC",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flex: 1,
    fontSize: 32,
    textAlign: "center",
    color: 'white'
  },
  image: {
    marginTop: 12, 
    height: 50,
    width: 50,
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
    width: windowWidth-24,
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
  width: windowWidth-24,
};
const TITLE: TextStyle = {
  ...TEXT,
  // ...BOLD,
  fontSize: 28,
  lineHeight: 38,
  textAlign: "center",
  marginBottom: spacing[5],
  textTransform: 'capitalize'
};

const FULL: ViewStyle = {
  flex: 1
};

export const CommonGoalDetailScreen = observer(function CommonGoalDetailScreen() {
  const { goalsStore, dailyGoalStore, userStore } = useStores();

  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as Goal;
  const myGoal: Goal = goalsStore.listOfGoals.filter(goal => goal.id == id)[0];
  const { LTgoal, description, STgoals } = myGoal;

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
    for (let i = 0; i < goal.mon.length; i++) monday.push([goal.mon[i], goal.title, goal.id])
    for (let i = 0; i < goal.tue.length; i++) tuesday.push([goal.tue[i], goal.title, goal.id])
    for (let i = 0; i < goal.wed.length; i++) wednesday.push([goal.wed[i], goal.title, goal.id])
    for (let i = 0; i < goal.thu.length; i++) thursday.push([goal.thu[i], goal.title, goal.id])
    for (let i = 0; i < goal.fri.length; i++) friday.push([goal.fri[i], goal.title, goal.id])
    for (let i = 0; i < goal.sat.length; i++) saturday.push([goal.sat[i], goal.title, goal.id])
    for (let i = 0; i < goal.sun.length; i++) sunday.push([goal.sun[i], goal.title, goal.id])
  }

  if (monday.length > 0) {
    allSTGoals.push({
      title: "Monday",
      data: monday.sort(sortFunction)
    });
  }
  if (tuesday.length > 0) {
    allSTGoals.push({
      title: "Tuesday",
      data: tuesday.sort(sortFunction)
    });
  }
  if (wednesday.length > 0) {
    allSTGoals.push({
      title: "Wednesday",
      data: wednesday.sort(sortFunction)
    });
  }
  if (thursday.length > 0) {
    allSTGoals.push({
      title: "Thursday",
      data: thursday.sort(sortFunction)
    });
  }
  if (friday.length > 0) {
    allSTGoals.push({
      title: "Friday",
      data: friday.sort(sortFunction)
    });
    console.log(allSTGoals)
  }
  if (saturday.length > 0) {
    allSTGoals.push({
      title: "Saturday",
      data: saturday.sort(sortFunction)
    });
  }
  if (sunday.length > 0) {
    allSTGoals.push({
      title: "Sunday",
      data: sunday.sort(sortFunction)
    });
  }

  function sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    } else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  const Item = ({ title }) => {
    const timeStr = getDisplayTime(userStore.timeMode, title[0])
    return (
      <View style={styles.item}>
        <Text style={{...styles.black, maxWidth: 190}}>{title[1]}</Text>
        <Text style={styles.right}>{timeStr}</Text>
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
        {/* < Separator /> */}
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
