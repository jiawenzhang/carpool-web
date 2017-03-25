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
  Label,
  Cells,
  Cell,
  CellsTitle,
  CellHeader,
  CellBody,
  Button,
  ActionSheet,
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


class TimePage extends React.Component {
    constructor(props) {
        super(props);

        var {lastPage, startTime, endTime} = this.props;
        console.log("lastPage " + lastPage);

        var date = now;
        var timeWindow = null
        var time = null
        var proximateTime = "Any time";
        if (startTime && endTime) {
          date = startTime
          timeWindow = endTime.diff(startTime, 'minutes');
          time = startTime.clone().add(timeWindow/2, 'minutes');
        }

        this.state = {
          timePopupVisible: false,
          datePopupVisible: false,
          flexibilityPopupVisible: false,
          date: date,
          proximateTime: proximateTime,
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
      this.setState({
        proximateTime: "Any time",
        time: null
      });
      this.hideActionMenu();
    }

    morning = () => {
      console.log("morning");
      this.setState({
        proximateTime: "Morning",
        time: null
      });
      this.hideActionMenu();
    }

    afternoon = () => {
      console.log("afternoon");
      this.setState({
        proximateTime: "Afternoon",
        time: null
      });
      this.hideActionMenu();
    }

    evening = () => {
      console.log("evening");
      this.setState({
        proximateTime: "Evening",
        time: null
      });
      this.hideActionMenu();
    }

    hideActionMenu() {
      this.setState({
        autoShow: false,
        iosShow: false,
        androidShow: false,
      })
    }

    setMoreTimeVisible(visible) {
      this.setState({
        timePopupVisible: visible
      });
    }

    moreTimeOption() {
      this.hideActionMenu();
      this.setMoreTimeVisible(true);
    }

    onDateChange = (date) => {
        console.log('onDateChange', date.format("lll"));
        console.log("onDateChange, day " + date.date())
        this.setState({
            date: date
        });
    }

    onTimeChange = (time) => {
      console.log('onTimeChange', time.format("lll"));
      this.setState({
        proximateTime: null,
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
        flexibilityPopupVisible: false,
        timeWindow: timeWindow,
        timeWindowStr: this.timeWindowStr(timeWindow)
      });
    }

    onTimePopupDismiss = () => {
      console.log('onDismiss');
      this.setState({
        timePopupVisible: false
      });
    }

    onDatePopupDismiss = () => {
      console.log('onDismiss');
      this.setState({
        datePopupVisible: false
      });
    }

    onDateOk = () => {
      this.onDatePopupDismiss();
    }

    onFlexibilityPopupDismiss = () => {
      console.log('onDismiss');
      this.setState({
        flexibilityPopupVisible: false
      });
    }

    next = () => {
      var date = this.state.date
      var proximateTime = this.state.proximateTime;
      var startTime;
      var endTime;
      if (proximateTime) {
        if (proximateTime === "Any time") {
          startTime = date.clone().hour(0).minute(0);
          endTime = date.clone().hour(23).minute(59);
        } else if (proximateTime === "Morning") {
          startTime = date.clone().hour(0).minute(0);
          endTime = date.clone().hour(12).minute(0);
        } else if (proximateTime === "Afternoon") {
          startTime = date.clone().hour(12).minute(0);
          endTime = date.clone().hour(18).minute(0);
        } else if (proximateTime === "Evening") {
          startTime = date.clone().hour(18).minute(0);
          endTime = date.clone().hour(23).minute(59);
        }
      } else {
        var timeWindow = this.state.timeWindow
        console.log("timeWindow: " + timeWindow);
        var startTime = this.state.time.clone()
        var endTime = this.state.time.clone()
        startTime.subtract(timeWindow/2, 'minutes')
        endTime.add(timeWindow/2, 'minutes');
      }

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

    formatTime() {
      if (this.state.proximateTime) {
        return this.state.proximateTime;
      }
      return (this.state.time && this.state.time.format("HH:mm") || "Time")
    }

    renderTimeActionSheet() {
      return (
      <div>
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
        timePopupVisible: false
      });
    }

    renderMoreTimePopup() {
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
        visible={this.state.timePopupVisible}
        onOk={this.onExactTimeOk}
        onDismiss={this.onTimePopupDismiss}
        onChange={this.onTimeChange}
        >

        </PopupDatePicker>
        </div>
      )
    }

    showDatePopup = () => {
      this.setState({
        datePopupVisible: true
      })
    }

    showTimePopup = () => {
      this.setState({
        timePopupVisible: true
      })
    }

    showFlexibilityPopup = () => {
      console.log("showFlexibilityPopup");
      this.setState({
        flexibilityPopupVisible: true
      })
    }

    renderDate() {
      return (
        <div>
        <CellsTitle>{"Pick a date to leave"}</CellsTitle>
        <Cells>
            <Cell>
                <CellHeader>
                  <Label>Date</Label>
                </CellHeader>
                <CellBody>
                <div
                onClick={this.showDatePopup}>
                {this.state.date && this.state.date.format("ddd MMM Do") || "Date"}
                </div>
                </CellBody>
            </Cell>
        </Cells>
        </div>
      )
    }

    renderTime() {
      return (
        <div>
        <CellsTitle>{"Pick a time to leave"}</CellsTitle>
        <Cells>
            <Cell>
                <CellHeader>
                  <Label>Time</Label>
                </CellHeader>
                <CellBody>
                <div
                onClick={e=>this.setState({autoShow: true})}>
                {this.formatTime()}
                </div>
                </CellBody>
            </Cell>

            {this.state.time &&
            <Cell>
                <CellHeader>
                  <Label>Flexibility</Label>
                </CellHeader>
                <CellBody>
                <div
                onClick={this.showFlexibilityPopup}>
                  {this.state.timeWindowStr ? this.state.timeWindowStr : "On time"}
                </div>
                </CellBody>
            </Cell>
            }
        </Cells>
        </div>
      )
    }

    renderDatePopup() {
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
        visible={this.state.datePopupVisible}
        onDismiss={this.onDatePopupDismiss}
        onOk={this.onDatePopupDismiss}
        onChange={this.onDateChange}
        >

        </PopupDatePicker>
      );
    }

    renderFlexibilityPopup() {
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

      transitionName="rmc-picker-popup-slide-fade"
      maskTransitionName="rmc-picker-popup-fade"
      title=""
      visible={this.state.flexibilityPopupVisible}
      onOk={this.onTimeWindowOk}
      onDismiss={this.onFlexibilityPopupDismiss}
      value={this.state.timeWindow}>
      </PopupPicker>
    )
  }

  renderNextButton() {
    return (
      <div style={{marginLeft: 20, marginRight: 20}}>
        <Button
          type="primary"
          onClick={this.next}>
          {"Next"}
        </Button>
      </div>
    )
  }

  renderSpace() {
    return (
      <div className="col-xs-12" style={{marginTop: 10, marginBottom: 10, fontSize: 20, color: "grey", textAlign: "left"}}>
      </div>
    )
  }

    render() {
        if (!Parse.User.current()) {
          return;
        }
        console.log("TimePage render, number: " + this.props.number);
        console.log("TimePage render, isDriver: " + this.props.isDriver);

        return (
          <div style={{maxWidth: 800, width: "100%", height: "100%", backgroundColor: "whitesmoke"}}>
                <div style={{height: 80}}>
                </div>

                {this.renderDate()}
                {this.renderTime()}

                {this.renderDatePopup()}
                {this.renderTimeActionSheet()}
                {this.renderMoreTimePopup()}
                {this.renderFlexibilityPopup()}

                <div className="col-xs-12" style={{height: 70}}>
                </div>
                {this.renderNextButton()}
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
    isDriver: state.count.isDriver,
    lastPage: state.count.lastPage}),
  { setStartTime,
    setEndTime }
)(TimePage)
