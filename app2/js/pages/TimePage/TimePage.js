/* tslint:disable:no-console */

import 'rmc-picker/assets/index.css';
//import 'rmc-date-picker/assets/index.css';
import '../../../../../m-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PopupDatePicker from '../../../../../m-date-picker/lib/popup';
//import PopupDatePicker from 'rmc-date-picker';
//import DatePicker from 'rmc-date-picker';
import DatePicker from '../../../../../m-date-picker/lib';
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

        this.state = {
          date: null,
        };
    }

    onDateChange = (date) => {
        console.log('onDateChange', format(date));
        console.log("onDateChange, day " + date.date())
        this.setState({
            date: date
        });
    }

    onStartTimeChange = (startTime) => {
        console.log('onStartTimeChange', format(startTime));
        this.setState({
            startTime: startTime,
            endTime: null
        });
    }

    onEndTimeChange = (endTime) => {
        console.log('onEndTimeChange', format(endTime));
        this.setState({
            endTime: endTime
        });
    }

    onDismiss = () => {
        console.log('onDismiss');
    }

    show = () => {
        console.log('show');
    }

    ok = () => {
      console.log("ok");

      let date = this.state.date
      var startTime = this.state.startTime.clone();
      startTime.year(date.year()).month(date.month()).date(date.date());

      var endTime = this.state.endTime.clone();
      endTime.year(date.year()).month(date.month()).date(date.date());

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
        let startTime = this.state.startTime
        let endTime = this.state.endTime

        const datePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={now}
            maxDate={maxDate}
            defaultDate={now}
            mode={'date'}
            />
        );

        const startTimePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={minTime}
            maxDate={maxTime}
            defaultDate={now}
            mode={'time'}
            />
        );

        const endTimePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={startTime}
            maxDate={maxTime}
            defaultDate={startTime}
            mode={'time'}
            />
        );
                // <div className="col-xs-12" style={{marginTop: 40, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                //   between
                // </div>

        return (
          <div style={{maxWidth: 600, width: "80%", margin: "0 auto 10px"}}>
                <div className="col-xs-12" style={{marginBottom: 30, fontSize: 26, textAlign: "center"}}>
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
                <PopupDatePicker
                datePicker={startTimePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={startTime}
                mode={"time"}
                onDismiss={this.onDismiss}
                onChange={this.onStartTimeChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  disabled={date ? false : true}
                  block>
                  {startTime && startTime.format("HH:mm") || "Earliest time"}
                </Button>

                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
                </div>

                <div>
                <PopupDatePicker
                datePicker={endTimePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={endTime}
                mode={"time"}
                onDismiss={this.onDismiss}
                onChange={this.onEndTimeChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  disabled={startTime ? false : true}
                  block>
                  {endTime && endTime.format("HH:mm") || "Latest time"}
                </Button>
                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{height: 70}}>
                </div>

                <Button
                  bsSize="large"
                  onClick={this.ok}
                  disabled={endTime ? false : true}
                  block>
                  {"OK"}
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
    isDriver: state.count.isDriver}),
  { setStartTime,
    setEndTime }
)(TimePage)
