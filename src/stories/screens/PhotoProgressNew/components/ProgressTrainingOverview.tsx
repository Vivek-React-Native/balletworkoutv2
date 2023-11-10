import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from '@balletworkout/components';
import i18n from '../../../../common/i18n';
import {Card} from 'native-base';
import {HEIGHT, WIDTH} from '../../../../utilities/Theme';
import beautyPosture from '@balletworkout/assets/images/beautiful_posture.png';
import starIcon from '@balletworkout/assets/images/star-icon.png';
import {LineChart} from 'react-native-chart-kit';
import {useDispatch, useSelector} from 'react-redux';
import TrainingProgressCore from '../../../../common/training';
import moment from 'moment';
import {groupBy} from '../../../../utilities/Functions';
import {baseServerUri} from '../../../../common/appConstants';
import PropTypes from 'prop-types';
import {Circle, G, Rect, Text as _Text} from 'react-native-svg';
import explaceHolderImage from '@balletworkout/assets/images/Ballerina_PlaceholderExercises.jpg';
const screenWidth = Dimensions.get('window').width;

const Tooltip = ({x, y, textX, textY, stroke, pointStroke, position}) => {
  let tipW = 72,
    tipH = 36,
    tipX = 8,
    tipY = -9,
    tipTxtX = 12,
    tipTxtY = 6;
  const posY = y;
  const posX = x;

  if (posX > screenWidth - tipW - 50) {
    tipX = -(tipX + tipW - 2);
    tipTxtX = tipTxtX - tipW - 13;
  }

  const boxPosX = position === 'left' ? posX - tipW - 10 : posX;
  return (
    <G>
      <Circle
        cx={posX}
        cy={posY}
        r={4}
        stroke={pointStroke}
        strokeWidth={2}
        fill={'blue'}
      />
      <G x={boxPosX < 40 ? 40 : boxPosX} y={posY}>
        <Rect
          x={tipX + 1}
          y={tipY - 1}
          width={tipW - 2}
          height={tipH - 2}
          fill={'rgba(255, 255, 255, 1)'}
          rx={2}
          ry={2}
        />
        <_Text x={tipTxtX} y={tipTxtY + 7} fontSize="18" textAnchor="start">
          {moment('2015-01-01')
            .startOf('day')
            .seconds(textY)
            .format('H:mm:ss')}
        </_Text>
      </G>
    </G>
  );
};

Tooltip.propTypes = {
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  height: PropTypes.number,
  stroke: PropTypes.string,
  pointStroke: PropTypes.string,
  textX: PropTypes.string,
  textY: PropTypes.string,
  position: PropTypes.string,
};

Tooltip.defaultProps = {
  position: 'rigth',
};

const tooltipDecorators = state => () => {
  if (state === null) {
    return null;
  }

  const {index, value, x, y} = state;

  return (
    <Tooltip
      textX={'test'}
      textY={value}
      x={x}
      y={y}
      stroke={'#ffffff'}
      pointStroke={'#00ccff'}
      position={'center'}
    />
  );
};

const WorkoutHistoryItem = ({item}) => {
  const {
    name,
    goal_image,
    banner_image_dir,
    banner_image,
    image_prefix,
    timeSum,
  } = item;
  return (
    <TouchableOpacity style={styles.imageRowContainer}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.mainImage}
          resizeMode={'cover'}
          source={
            goal_image
              ? {uri: goal_image}
              : banner_image
              ? {
                  uri:
                    baseServerUri +
                    banner_image_dir +
                    image_prefix +
                    banner_image,
                }
              : explaceHolderImage
          }
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.buttonText]} font={'SemiBold'}>
          {name}
        </Text>
        <View style={styles.tagContainer}>
          {/* <View style={styles.tagContent}>
                        <Image style={styles.starIcon} resizeMode={'contain'} source={starIcon}/>
                        <Text style={[styles.tagText]} font={'SemiBold'}>
                            4.8
                        </Text>
                    </View> */}
          <View style={styles.tagContent}>
            <Text style={[styles.tagText]} font={'SemiBold'}>
              Beginner
            </Text>
          </View>
        </View>
        <Text style={styles.textDescription} font={'SemiBold'}>
          Trained for{' '}
          {moment('2015-01-01')
            .startOf('day')
            .seconds(timeSum)
            .format('H:mm:ss')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const WorkoutHistory = ({trainingData}) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const isChanged = useSelector(state =>
    TrainingProgressCore.selectors.isChanged(state),
  );

  useEffect(() => {
    dataHandling();
  }, [isChanged]);

  const dataHandling = () => {
    const trainingArr = Object.keys(trainingData).map(key => trainingData[key]);
    const filtered = trainingArr.filter(item =>
      moment(item.date).isSame(new Date(), 'week'),
    );
    const grouped = groupBy(filtered, 'categoryId');
    const categories: any[] = Object.keys(grouped).map(key => {
      let result = grouped[key][0].category;
      let timeSum = 0;
      grouped[key].map(item => {
        timeSum += item.time;
      });
      result['timeSum'] = timeSum;
      return result;
    });
    // console.log('categories:', categories);
    setCategoriesList(categories);
  };
  return (
    <View>
      <View>
        <Text style={styles.textBold}>{i18n.t("progress.WorkoutHistory")}</Text>
      </View>
      <Card transparent style={styles.card}>
        <FlatList
          data={categoriesList}
          renderItem={({item}) => <WorkoutHistoryItem item={item} />}
          contentContainerStyle={styles.container}
        />
      </Card>
    </View>
  );
};

const OverviewChart = ({trainingData, valueFormatter, ...props}) => {
  const isChanged = useSelector(state =>
    TrainingProgressCore.selectors.isChanged(state),
  );
  const [weekData, setWeekData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [state, setState] = useState(null);
  useEffect(() => {
    dataHandling();
  }, [isChanged]);

  const dataHandling = () => {
    const trainingArr = Object.keys(trainingData).map(key => trainingData[key]);
    const filtered = trainingArr.filter(item =>
      moment(item.date).isSame(new Date(), 'week'),
    );
    const grouped = groupBy(filtered, 'date');
    const list: any[] = Object.keys(grouped).map(key => {
      let timeSum = 0;
      grouped[key].map(item => {
        timeSum += item.time;
      });
      return {[key]: timeSum};
    });

    const startDay = moment().startOf('week');
    const endDay = moment().endOf('week');
    let days = [];
    let day = startDay;
    while (day <= endDay) {
      const formatedDate = moment(day.toDate()).format('YYYY-MM-DD');
      if (grouped[formatedDate]) {
        let timeSum = 0;
        grouped[formatedDate].map(item => {
          timeSum += item.time;
        });
        days.push(timeSum);
      } else {
        days.push(0);
      }
      day = day.clone().add(1, 'd');
    }
    setWeekData(days);
  };

  return (
    <View>
      <View>
        <Text style={styles.textBold}>{i18n.t('progress.TrainingOverview')}</Text>
      </View>
      <Card transparent style={styles.card}>
        <LineChart
          data={{
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [
              {
                data: weekData,
              },
            ],
          }}
          width={WIDTH * 0.9} // from react-native
          height={WIDTH * 0.65}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundColor: '#F2E6E6',
            backgroundGradientFrom: '#F2E6E6',
            backgroundGradientTo: '#F2E6E6',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 0,
            },
          }}
          bezier
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines
          style={{
            marginVertical: 8,
            paddingRight: WIDTH * 0.08,
          }}
          decorator={tooltipDecorators(state)}
          onDataPointClick={setState}
        />
      </Card>
    </View>
  );
};

const ProgressTrainingOverview = props => {
  const trainingData = useSelector(state =>
    TrainingProgressCore.selectors.trainings(state),
  );
  const isChanged = useSelector(state =>
    TrainingProgressCore.selectors.isChanged(state),
  );
  useEffect(() => {}, [isChanged]);
  return (
    <View style={styles.container}>
      <OverviewChart trainingData={trainingData} />
      <WorkoutHistory trainingData={trainingData} />
    </View>
  );
};
export default ProgressTrainingOverview;

const styles = StyleSheet.create({
  container: {
    marginBottom: 85,
  },
  textBold: {
    textAlign: 'left',
    fontSize: 24,
    color: '#032426',
    marginTop: 20,
  },
  card: {
    flex: 1,
    marginTop: 0,
    marginBottom: 0,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2E6E6',
    width: WIDTH * 0.2,
    height: WIDTH * 0.2,
    borderRadius: 10,
  },
  imageRowContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 10,
    backgroundColor: '#F7F7F7',
    padding: 5,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  mainImage: {
    position: 'absolute',
    width: WIDTH * 0.16,
    height: WIDTH * 0.16,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  buttonText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
    color: '#032426',
    marginVertical: 2,
  },
  textDescription: {
    fontSize: 12,
    color: '#032426',
    marginVertical: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tagContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: '#F2E6E6',
    marginRight: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#032426',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 2,
  },
  starIcon: {
    width: 15,
    height: 13,
    marginRight: 5,
    marginTop: -2,
    alignSelf: 'center',
  },
});
