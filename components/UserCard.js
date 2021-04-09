import React from "react";
import {
  ImageBackground,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Card, ListItem, Avatar, Button, Icon } from "react-native-elements";
import { Rating, AirbnbRating } from "react-native-ratings";

const UserCard = (probs) => {
  const dimensions = Dimensions.get("window");
  const AvatarWidth = dimensions.width / 2;

  function roundNum(num) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
  }

  function viewUserDetail() {}
  return (
    <TouchableOpacity
      onPress={() =>
        probs.currentUser
          ? probs.navigation.navigate("UserDetail", {
              userId: probs.user.id,
            })
          : probs.navigation.replace("SignInContainer")
      }
    >
      <Card>
        <ImageBackground
          source={
            probs.user.background != null
              ? { uri: "http://44.240.53.177/files/" + probs.user.background }
              : { uri: "http://44.240.53.177/gradiants/0.png" }
          }
          style={{ height: 100, width: null, flex: 2 }}
        ></ImageBackground>

        <Avatar
          containerStyle={{
            flex: 2,
            marginTop: -35,
            marginLeft: AvatarWidth - 70,
          }}
          rounded
          size="large"
          source={
            probs.user.image != null
              ? { uri: "http://44.240.53.177/files/" + probs.user.image }
              : {
                  uri:
                    "data:image/png;base64,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",
                }
          }
        />

        <Text style={{ alignSelf: "center", fontSize: 22, fontWeight: "bold" }}>
          {probs.user.firstName}
        </Text>
        <Text style={{ alignSelf: "center" }}>
          {probs.user.city?.name}, {probs.user.country?.name}
        </Text>

        <View style={{ flex: 1, flexDirection: "column" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "space-around",
              marginBottom: 10,
            }}
          >
            <Text style={{ marginLeft: -25, fontWeight: "bold" }}>
              Total Review{" "}
            </Text>
            <Text style={{ fontWeight: "bold" }}>({probs.user.rateCount})</Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text>Technical Skill</Text>
            <Rating
              fractions="{1}"
              startingValue={roundNum(probs.user.technicalRateAvg / 2)}
              imageSize={20}
              style={{ textAlign: "center", marginLeft: 45 }}
            />
          </View>

          <View
            style={{
              flex: 1,
              marginTop: 3,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text>On Time</Text>
            <Rating
              fractions="{1}"
              startingValue={roundNum(probs.user.timeRateAvg / 2)}
              imageSize={20}
              style={{ textAlign: "center", marginLeft: 80 }}
            />
          </View>

          <View
            style={{
              flex: 1,
              marginTop: 3,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text>Communication Skill</Text>
            <Rating
              fractions="{1}"
              startingValue={roundNum(probs.user.communicationRateAvg / 2)}
              imageSize={20}
              style={{ textAlign: "center", marginLeft: 5 }}
            />
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "column", marginTop: 20 }}>
          {/* style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',flexWrap:'wrap'}} */}
          <View
            style={{
              flex: 2,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {probs.user.skills.map((l, i) => (
              <ListItem key={i} containerStyle={{ margin: 0, padding: 3 }}>
                <Button
                  style={{ padding: 0, height: 35 }}
                  title={l.name + "(" + l.percent + " years)"}
                  type="solid"
                  titleStyle={{
                    fontSize: 12,
                  }}
                  disabled={true}
                />
              </ListItem>
            ))}
          </View>

          <Card.Divider></Card.Divider>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Icon name="currency-usd" type="material-community" />
            <Text style={{ marginRight: 15 }}>
              {probs.user.hourRates[0] != undefined
                ? probs.user.hourRates[0].amount
                : 0}{" "}
              / Hr
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Icon name="account-clock" type="material-community" />
            <Text>{probs.user.experimentAvg} years</Text>
          </View>

          <Icon
            name="share-variant"
            type="material-community"
            style={{ alignSelf: "flex-end", marginRight: 20 }}
          />
          <Icon
            name="eye"
            type="material-community"
            onPress={() =>
              probs.currentUser
                ? probs.navigation.navigate("UserDetail", {
                    userId: probs.user.id,
                  })
                : probs.navigation.replace("SignInContainer")
            }
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default UserCard;
