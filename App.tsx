import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, StatusBar } from "react-native";
import styled from "styled-components/native";
import { Rating } from "./src/components/Rating";
import { Genre } from "./src/components/Genre";
import { getMovies } from "./api";
import * as CONSTANTS from './src/constants/constants'
import { fontFamilies } from './src/constants/ui/fonts';

interface Movie {
  key: string;
  originalTitle: string;
  posterPath: string;
  voteAverage: number;
  genres: string[];
  description: string;
}

const Container = styled.View`
  flex:1;
`
const PosterContainer = styled.View`
  width: ${CONSTANTS.ITEM_SIZE}px;
`
const Poster = styled.View`
  margin-horizontal: ${CONSTANTS.SPACING}px;
  padding: ${CONSTANTS.SPACING*2}px;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 10px;
`

const PosterImage = styled.Image`
  width: 100%;
  height: ${CONSTANTS.ITEM_SIZE * 1.2}px;
  resize-mode: cover;
  border-radius: 10px;
  margin: 0 0 10px 0;
`

const PosterTitle = styled.Text`
  font-family: ${fontFamilies.SYNEMONO.normal};
  font-size: 18px;
`

const PosterDescription = styled.Text`
  font-family: ${fontFamilies.SYNEMONO.normal};
  font-size: 12px;
`

const DummyContainer = styled.View`
  width: ${CONSTANTS.SPACER_ITEM_SIZE}px;
`

function App(): React.JSX.Element {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMovies()
      setMovies([{key: 'left-spacer'}, ...data, {key: 'right-spacer'}])
      setLoaded(true)
    }
    fetchData()
  },[])
  
  const scrollX = useRef(new Animated.Value(0)).current


  return (
    <Container>
      <StatusBar />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        snapToInterval={CONSTANTS.ITEM_SIZE}
        decelerationRate={0}
        data={movies}
        keyExtractor={item =>item.key}
        horizontal
        contentContainerStyle={{
          alignItems: 'center'
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          { useNativeDriver: true}
        )}
        scrollEventThrottle={16}  
        renderItem={({item, index}) =>{   
          const inputRange = [
            (index - 2) * CONSTANTS.ITEM_SIZE,
            (index -1) * CONSTANTS.ITEM_SIZE,
            index * CONSTANTS.ITEM_SIZE,
          ]   
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [0, -50, 0]
          })    

          if (!item.originalTitle) {
            return <DummyContainer/>
          }

          return (
          <PosterContainer>
            <Poster as={Animated.View} style={{transform: [{translateY}]}}>
              <PosterImage source={{uri: item.posterPath}}/>
              <PosterTitle numberOfLines={1}>{item.originalTitle}</PosterTitle>
              <Rating rating={item.voteAverage}/>
              <Genre genres={item.genres}/>
              <PosterDescription numberOfLines={5}>{item.description}</PosterDescription>
            </Poster>
          </PosterContainer>
          )
        }}
        />
    </Container>
  );
}


export default App;
