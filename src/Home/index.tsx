import { useEffect, useState } from "react"
import { Box } from "native-base"
import { Camera, CameraType, FaceDetectionResult } from "expo-camera"
import * as FaceDetector from "expo-face-detector"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

import neutralFace from "../../assets/img/neutral-face.png"
import smileFace from "../../assets/img/smile.png"
import winkingFace from "../../assets/img/winking.png"
import { ImageSourcePropType } from "react-native"

export const Home = () => {
  const [faceDetected, setFaceDetected] = useState(false)
  const [permission, requestPermission] = Camera.useCameraPermissions()
  const [face, setFace] = useState<ImageSourcePropType>(neutralFace)

  const faceValues = useSharedValue({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  })

  const handleFacesDetected = ({ faces }: FaceDetectionResult) => {
    const face = faces[0] as any

    if (face) {
      const { size, origin } = face.bounds

      faceValues.value = {
        width: size.width,
        height: size.height,
        x: origin.x,
        y: origin.y,
      }

      if (face.smilingProbability > 0.5) {
        console.log("sorriu")
        setFace(smileFace)
      } else if (face.rightEyeOpenProbability < 0.5) {
        console.log("piscou")
        setFace(winkingFace)
      } else {
        console.log("neutro")
        setFace(neutralFace)
      }

      setFaceDetected(true)
    } else {
      setFaceDetected(false)
    }
  }

  const animatedStyled = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX: faceValues.value.x },
      { translateY: faceValues.value.y },
    ],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "green",
  }))

  useEffect(() => {
    requestPermission()
  }, [])

  if (!permission?.granted) {
    return null
  }

  return (
    <Box h="100%" bg="gray.700">
      {faceDetected && <Animated.Image style={animatedStyled} source={face} />}
      <Camera
        style={{ flex: 1 }}
        ratio="16:9"
        type={CameraType.front}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
      />
    </Box>
  )
}
