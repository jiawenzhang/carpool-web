import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PopupDatePicker from 'rmc-date-picker/lib/popup';
import DatePicker from 'rmc-date-picker/lib';
import MultiPicker from 'rmc-picker/lib/MultiPicker'
import PopupPicker from 'rmc-picker/lib/Popup'
import { Button } from 'react-bootstrap'

import moment from 'moment';
//import zhCn from '../src/locale/zh_CN';
//import enUs from '../src/locale/en_US';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import { connect } from 'react-redux'
import { setStartTime, setEndTime } from '../../actions/count'

const cn = location.search.indexOf('cn') !== -1;

const now = moment();
var minTime = moment();
var maxTime = moment();
minTime.hour(0).minute(0);
maxTime.hour(23).minute(59);
const maxDate = moment(now).add(10, 'day');


// if (cn) {
//   minDate.locale('zh-cn').utcOffset(8);
//   maxDate.locale('zh-cn').utcOffset(8);
//   now.locale('zh-cn').utcOffset(8);
// } else {
//   minDate.locale('en-gb').utcOffset(0);
//   maxDate.locale('en-gb').utcOffset(0);
//   now.locale('en-gb').utcOffset(0);
// }

function format(date) {
    return date.format('lll');
}

class TimePage extends React.Component {
    // static defaultProps = {
    //     mode: 'datetime',
    //     locale: cn ? zhCn : enUs,
    // };

    constructor(props) {
        super(props);

        let {startTime, endTime} = this.props
        var date = null
        var timeWindow = 0
        var time = null
        if (startTime && endTime) {
          date = startTime
          timeWindow = endTime.diff(startTime, 'minutes');
          time = startTime.clone().add(timeWindow/2, 'minutes');
        }

        this.state = {
          date: date,
          time: time,
          timeWindow: timeWindow,
          timeWindowStr: this.timeWindowStr(timeWindow)
        };
    }

    onDateChange = (date) => {
        console.log('onDateChange', format(date));
        console.log("onDateChange, day " + date.date())
        this.setState({
            date: date
        });
    }

    onTimeChange = (time) => {
        console.log('onTimeChange', format(time));
        this.setState({
            time: time
        });
    }

    timeWindowStr = (timeWindow) => {
      var timeWindowStr;
      switch (timeWindow) {
        case 0 :
          timeWindowStr = "On time";
          break;
        case 10:
          timeWindowStr = "10 min window";
          break;
        case 20:
          timeWindowStr = "20 min window";
          break;
        case 30:
          timeWindowStr = "30 min window";
          break;
        case 60:
          timeWindowStr = "1 hour window";
          break;
        case 120:
          timeWindowStr = "2 hour window";
          break;
      }
      return timeWindowStr
    }

    onTimeWindowOk = (value) => {
      let timeWindow = parseInt(value); // time window in minutes
      this.setState({
        timeWindow: timeWindow,
        timeWindowStr: this.timeWindowStr(timeWindow)
      });
    }

    onDismiss = () => {
        console.log('onDismiss');
    }

    show = () => {
        console.log('show');
    }

    next = () => {
      let timeWindow = this.state.timeWindow
      console.log("timeWindow: " + timeWindow);
      var startTime = this.state.time.clone()
      var endTime = this.state.time.clone()
      startTime.subtract(timeWindow/2, 'minutes')
      endTime.add(timeWindow/2, 'minutes');

      let date = this.state.date
      startTime.year(date.year()).month(date.month()).date(date.date());
      if (endTime.dayOfYear() != startTime.dayOfYear()) {
        // the endTime is on the next day of startTime
        endTime.year(date.year()).month(date.month()).date(date.date() + 1);
      } else {
        endTime.year(date.year()).month(date.month()).date(date.date());
      }

      console.log("startTime " + startTime.format('lll'))
      console.log("endTime " + endTime.format('lll'))

      let {setStartTime, setEndTime} = this.props;
      setStartTime(startTime)
      setEndTime(endTime)

      this.context.router.push('/route')
    }

    render() {
        console.log("TimePage render, number: " + this.props.number);
        console.log("TimePage render, isDriver: " + this.props.isDriver);
        const props = this.props;
        let date = this.state.date
        let time = this.state.time

        const datePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={now}
            maxDate={maxDate}
            defaultDate={now}
            mode={'date'}
            />
        );

        const timePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={minTime}
            maxDate={maxTime}
            defaultDate={now}
            mode={'time'}
            minuteStep={10}
            />
        );

        const timeWindow = [
          { label: 'On time', value: '0' },
          { label: '10 min window', value: '10' },
          { label: '20 min window', value: '20' },
          { label: '30 min window', value: '30' },
          { label: '1 hour window', value: '60' },
          { label: '2 hour window', value: '120' }
        ];
                // <div className="col-xs-12" style={{marginTop: 40, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                //   between
                // </div>

        return (
          <div style={{maxWidth: 600, width: "80%", margin: "0 auto 10px"}}>
                <div className="col-xs-12" style={{marginTop: 50, marginBottom: 30, fontSize: 26, textAlign: "center"}}>
                  When to leave?
                </div>

                <div>
                <PopupDatePicker
                datePicker={datePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={date}
                mode={"date"}
                onDismiss={this.onDismiss}
                onChange={this.onDateChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  block>
                  {date && date.format("ddd MMM Do") || "Date"}
                </Button>
                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                </div>

                <div>

                </div>

                <div>
                <PopupDatePicker
                datePicker={timePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={time}
                mode={"time"}
                onDismiss={this.onDismiss}
                onChange={this.onTimeChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  disabled={date ? false : true}
                  block>
                  {time && time.format("HH:mm") || "Time"}
                </Button>

                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                </div>

                <PopupPicker

                picker={
                  <MultiPicker>
                  {
                    [{props: {
                      children: timeWindow,
                      }
                    }]
                  }
                  </MultiPicker>
                }

                className="fortest"
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                onDismiss={this.onDismiss}
                onOk={this.onTimeWindowOk}
                value={this.state.timeWindow}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  disabled={time ? false : true}
                  block>
                  {this.state.timeWindowStr && this.state.timeWindowStr || "Time flexibility"}
                </Button>
                </PopupPicker>

                <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                </div>

                <div className="col-xs-12" style={{height: 70}}>
                </div>

                <Button
                  bsSize="large"
                  onClick={this.next}
                  disabled={this.state.timeWindowStr ? false : true}
                  block>
                  {"Next"}
                </Button>
          </div>);
    }
}

TimePage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default connect(
  state => (
  { number: state.count.number,
    startTime: state.count.startTime,
    endTime: state.count.endTime,
    isDriver: state.count.isDriver}),
  { setStartTime,
    setEndTime }
)(TimePage)
