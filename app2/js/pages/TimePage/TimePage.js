import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PopupDatePicker from 'rmc-date-picker/lib/Popup';
import DatePicker from 'rmc-date-picker/lib';
import MultiPicker from 'rmc-picker/lib/MultiPicker'
import PopupPicker from 'rmc-picker/lib/Popup'
import Parse from 'parse'
import {
  Form,
  FormCell,
  Label,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Input,
  Button,
  ButtonArea,
  ActionSheet,
  Picker,
} from 'react-weui';

//import weui styles
import 'weui';
import 'react-weui/lib/react-weui.min.css';

import moment from 'moment';
import { connect } from 'react-redux'
import { setStartTime, setEndTime } from '../../actions/count'

const now = moment();
var minTime = moment();
var maxTime = moment();
minTime.hour(0).minute(0);
maxTime.hour(23).minute(59);
const maxDate = moment(now).add(10, 'day');


function format(date) {
    return date.format('lll');
}

class TimePage extends React.Component {
    constructor(props) {
        super(props);

        let {startTime, endTime} = this.props
        var date = null
        var timeWindow = null
        var time = null
        if (startTime && endTime) {
          date = startTime
          timeWindow = endTime.diff(startTime, 'minutes');
          time = startTime.clone().add(timeWindow/2, 'minutes');
        }

        this.state = {
          popupVisible: false,
          date: date,
          time: time,
          timeWindow: timeWindow,
          timeWindowStr: this.timeWindowStr(timeWindow),
          autoShow: false,
          iosShow: false,
          androidShow: false,
          menus: [{
            label: 'Any time',
            onClick: this.anyTime.bind(this)
          }, {
            label: 'Morning',
            onClick: this.morning.bind(this)
          }, {
            label: 'Afternoon',
            onClick: this.afternoon.bind(this)
          }, {
            label: 'Evening',
            onClick: this.evening.bind(this)
          }],
          actions: [
            {
              label: 'More',
              onClick: this.moreTimeOption.bind(this)
            }
          ]
        };
    }

    anyTime = () => {
      console.log("anyTime");
      this.hide();
    }

    morning = () => {
      console.log("morning");
      this.hide();
    }

    afternoon = () => {
      console.log("afternoon");
      this.hide();
    }

    evening = () => {
      console.log("evening");
      this.hide();
    }

    hide() {
      this.setState({
        autoShow: false,
        iosShow: false,
        androidShow: false,
      })
    }

    setMoreTimeVisible(visible) {
      this.setState({
        popupVisible: visible
      });
    }

    moreTimeOption() {
      this.hide();
      this.setMoreTimeVisible(true);
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
      if (timeWindow == null) {
        return null
      }

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
      var timeWindow = parseInt(value); // time window in minutes
      this.setState({
        timeWindow: timeWindow,
        timeWindowStr: this.timeWindowStr(timeWindow)
      });
    }

    onDismiss = () => {
      console.log('onDismiss');
      this.setState({
        popupVisible: false
      });
    }

    next = () => {
      let timeWindow = this.state.timeWindow
      console.log("timeWindow: " + timeWindow);
      var startTime = this.state.time.clone()
      var endTime = this.state.time.clone()
      startTime.subtract(timeWindow/2, 'minutes')
      endTime.add(timeWindow/2, 'minutes');

      var date = this.state.date
      if (endTime.dayOfYear() != startTime.dayOfYear()) {
        // the endTime is on the next day of startTime
        endTime.year(date.year()).month(date.month()).date(date.date() + 1);
      } else {
        endTime.year(date.year()).month(date.month()).date(date.date());
      }
      startTime.year(date.year()).month(date.month()).date(date.date());

      console.log("startTime " + startTime.format('lll'))
      console.log("endTime " + endTime.format('lll'))

      let {setStartTime, setEndTime} = this.props;
      setStartTime(startTime)
      setEndTime(endTime)

      this.context.router.push('/route')
    }

    renderTimePicker() {
      return (
      <div>
      <Button
        type="default"
        onClick={
          e=>this.setState({autoShow: true})
        }
        disabled={this.state.date ? false : true}>
        {this.state.time && this.state.time.format("HH:mm") || "Time"}
      </Button>
      <ActionSheet
        menus={this.state.menus}
        actions={this.state.actions}
        show={this.state.autoShow}
        onRequestClose={
          e=>this.setState({autoShow: false})
        }
      />
      </div>
    )
    }

    onExactTimeOk = () => {
      console.log("onExactTimeOk");
      this.setState({
        popupVisible: false
      });
    }

    renderExactTimePicker() {
      const time = this.state.time
      const remainder = 10 - now.minute() % 10;
      // defaultTime is the next 10 min step from now
      const defaultTime = moment(now).add("minutes", remainder);
      const timePicker = (
        <DatePicker
        rootNativeProps={{'data-xx':'yy'}}
        minDate={minTime}
        maxDate={maxTime}
        mode={'time'}
        minuteStep={10}
        />
      );

      return (
        <div>
        <PopupDatePicker
        datePicker={timePicker}
        transitionName="rmc-picker-popup-slide-fade"
        maskTransitionName="rmc-picker-popup-fade"
        title=""
        date={time ? time : defaultTime}
        mode={"time"}
        visible={this.state.popupVisible}
        onOk={this.onExactTimeOk}
        onDismiss={this.onDismiss}
        onChange={this.onTimeChange}
        >

        </PopupDatePicker>
        </div>
      )
    }

    onFooterClick = () => {
      console.log("footerClick");
    }

    renderPicker() {
      return (
        <Cells>
            <Cell>
                <CellBody>
                    Title
                </CellBody>
                <CellFooter>
                <div
                onClick={this.onFooterClick}>
                AAAA
                </div>
                </CellFooter>
            </Cell>
        </Cells>
      )
    }

    renderDatePicker() {
      const datePicker = (
        <DatePicker
        rootNativeProps={{'data-xx':'yy'}}
        minDate={now}
        maxDate={maxDate}
        defaultDate={now}
        mode={'date'}
        />
      );

      return (
        <PopupDatePicker
        datePicker={datePicker}
        transitionName="rmc-picker-popup-slide-fade"
        maskTransitionName="rmc-picker-popup-fade"
        title=""
        date={this.state.date}
        mode={"date"}
        onDismiss={this.onDismiss}
        onChange={this.onDateChange}
        >

        <Button
        type="default"
        onClick={this.show}>
        {this.state.date && this.state.date.format("ddd MMM Do") || "Date"}
        </Button>
        </PopupDatePicker>
      );
    }

    renderSpace() {
      return (
        <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
        </div>
      )
    }

    renderFlexibility() {
      const timeWindow = [
        { label: 'On time', value: '0' },
        { label: '10 min window', value: '10' },
        { label: '20 min window', value: '20' },
        { label: '30 min window', value: '30' },
        { label: '1 hour window', value: '60' },
        { label: '2 hour window', value: '120' }
      ];

      return (
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
      type="default"
      onClick={this.show}
      disabled={this.state.time? false : true}>
        {this.state.timeWindowStr && this.state.timeWindowStr || "Time flexibility"}
      </Button>
      </PopupPicker>
    )
  }

    render() {
        if (!Parse.User.current()) {
          return;
        }
        console.log("TimePage render, number: " + this.props.number);
        console.log("TimePage render, isDriver: " + this.props.isDriver);
        const props = this.props;
        var date = this.state.date

        return (
          <div>
          {<div style={{maxWidth: 600, width: "80%", margin: "0 auto 10px"}}>
                <div className="col-xs-12" style={{marginTop: 50, marginBottom: 30, fontSize: 26, textAlign: "center"}}>
                  When to leave?
                </div>

                {this.renderDatePicker()}
                {this.renderSpace()}

                {this.renderTimePicker()}

                {this.renderExactTimePicker()}
                {this.renderSpace()}
                {this.renderSpace()}

                {this.renderFlexibility()}

                <div className="col-xs-12" style={{height: 70}}>
                </div>

                <Button
                  type="default"
                  onClick={this.next}
                  disabled={this.state.timeWindowStr ? false : true}>
                  {"Next"}
                </Button>
          </div>}
          </div>
        );
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
