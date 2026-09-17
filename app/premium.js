import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { setPremiumStatus } from "../lib/premiumStorage";
export default function PremiumScreen() {
  const router = useRouter();

  const handleActivatePremium = async () => {
    const success = await setPremiumStatus(true);

    if (success) {
      router.back();
    }
  };


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
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
              backgroundColor: "#111111",
              borderWidth: 1,
              borderColor: "#242424",
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
                color: "#E85002",
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
              "#C10801",
              "#3A0B08",
              "#0B0B0B",
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
                "rgba(232,80,2,0.25)",
            }}
          >
            <View
              style={{
                width: 62,
                height: 62,
                borderRadius: 20,
                backgroundColor:
                  "rgba(232,80,2,0.12)",
                borderWidth: 1,
                borderColor:
                  "rgba(232,80,2,0.25)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 22,
              }}
            >
              <Ionicons
                name="diamond"
                size={30}
                color="#E85002"
              />
            </View>

            <Text
              style={{
                color: "#E85002",
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
                color: "#A7A7A7",
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
              color: "#A7A7A7",
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
                  backgroundColor: "#111111",
                  borderRadius: 20,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: "#242424",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor:
                      "rgba(232,80,2,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color="#E85002"
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
                      color: "#A7A7A7",
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
  onPress={handleActivatePremium}
            style={{
              height: 58,
              borderRadius: 19,
              backgroundColor: "#E85002",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#0B0B0B",
                fontSize: 16,
                fontWeight: "900",
              }}
            >
              Découvrir Premium
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: "#646464",
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





