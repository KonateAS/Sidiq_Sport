import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PremiumScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#080C09",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 60,
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View
          style={{
            paddingTop: 58,
            paddingHorizontal: 24,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 46,
              height: 46,
              borderRadius: 15,
              backgroundColor: "#111511",
              borderWidth: 1,
              borderColor: "#202820",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={23}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              marginRight: 46,
            }}
          >
            <Text
              style={{
                color: "#00FF87",
                fontSize: 10,
                fontWeight: "900",
                letterSpacing: 2,
              }}
            >
              SIDIQ SPORT
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                fontWeight: "900",
                marginTop: 4,
              }}
            >
              Premium
            </Text>
          </View>
        </View>

        {/* ==================================================
            HERO PREMIUM
        ================================================== */}

        <View
          style={{
            marginHorizontal: 24,
            marginTop: 32,
          }}
        >
          <LinearGradient
            colors={[
              "#163B25",
              "#0D1911",
              "#080C09",
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={{
              borderRadius: 30,
              padding: 28,
              borderWidth: 1,
              borderColor:
                "rgba(0,255,135,0.25)",
            }}
          >
            <View
              style={{
                width: 62,
                height: 62,
                borderRadius: 20,
                backgroundColor:
                  "rgba(0,255,135,0.12)",
                borderWidth: 1,
                borderColor:
                  "rgba(0,255,135,0.25)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 22,
              }}
            >
              <Ionicons
                name="diamond"
                size={30}
                color="#00FF87"
              />
            </View>

            <Text
              style={{
                color: "#00FF87",
                fontSize: 12,
                fontWeight: "900",
                letterSpacing: 2,
              }}
            >
              SIDIQ SPORT PREMIUM
            </Text>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 30,
                fontWeight: "900",
                lineHeight: 36,
                marginTop: 10,
              }}
            >
              Va plus loin.
            </Text>

            <Text
              style={{
                color: "#A5ADA7",
                fontSize: 15,
                lineHeight: 23,
                marginTop: 10,
              }}
            >
              Débloque une expérience plus complète
              pour suivre ta progression et renforcer
              ta discipline.
            </Text>
          </LinearGradient>
        </View>

        {/* ==================================================
            AVANTAGES
        ================================================== */}

        <View
          style={{
            marginHorizontal: 24,
            marginTop: 32,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 21,
              fontWeight: "900",
            }}
          >
            Ce que tu débloques
          </Text>

          <Text
            style={{
              color: "#7F8781",
              fontSize: 13,
              marginTop: 5,
            }}
          >
            Des outils conçus pour aller plus loin.
          </Text>

          <View
            style={{
              marginTop: 18,
              gap: 10,
            }}
          >
            {[
              {
                icon: "analytics-outline",
                title: "Progression avancée",
                text: "Analyse plus complète de tes performances.",
              },
              {
                icon: "trophy-outline",
                title: "Objectifs Premium",
                text: "Des défis supplémentaires pour progresser.",
              },
              {
                icon: "stats-chart-outline",
                title: "Statistiques détaillées",
                text: "Une vision plus précise de ta régularité.",
              },
              {
                icon: "flash-outline",
                title: "Expérience sans limites",
                text: "Accède progressivement aux nouvelles fonctions Premium.",
              },
            ].map((item) => (
              <View
                key={item.title}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#101410",
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "#1D241F",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor:
                      "rgba(0,255,135,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#00FF87"
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "800",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      color: "#7F8781",
                      fontSize: 12,
                      lineHeight: 18,
                      marginTop: 4,
                    }}
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ==================================================
            ACTION
        ================================================== */}

        <View
          style={{
            marginHorizontal: 24,
            marginTop: 32,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              height: 58,
              borderRadius: 19,
              backgroundColor: "#00FF87",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#041009",
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              Découvrir Premium
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#59615B",
              fontSize: 11,
              textAlign: "center",
              marginTop: 12,
              lineHeight: 17,
            }}
          >
            Le paiement sera connecté ultérieurement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
