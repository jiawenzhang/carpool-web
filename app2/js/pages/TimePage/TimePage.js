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

const cn = location.search.indexOf('cn') !== -1;

const minDate = moment([2015, 8, 1, 0, 0, 0]);
const maxDate = moment([2018, 1, 1, 22, 0, 0]);
const now = moment();

if (cn) {
  minDate.locale('zh-cn').utcOffset(8);
  maxDate.locale('zh-cn').utcOffset(8);
  now.locale('zh-cn').utcOffset(8);
} else {
  minDate.locale('en-gb').utcOffset(0);
  maxDate.locale('en-gb').utcOffset(0);
  now.locale('en-gb').utcOffset(0);
}

function format(date) {
    return date.format('YYYY-MM-DD HH:mm');
}

class TimePage extends React.Component<any, any> {
    // static defaultProps = {
    //     mode: 'datetime',
    //     locale: cn ? zhCn : enUs,
    // };

    constructor(props) {
        super(props);
        this.state = {
            date: null,
        };
        this.isDriver = this.props.location.query.isDriver;
        console.log("driver: " + this.isDriver);
    }

    onDateChange = (date) => {
        console.log('onDateChange', format(date));
        this.setState({
            date,
        });
    }

    onEarliestTimeChange = (date) => {
        console.log('onEarliestTimeChange', format(date));
        this.setState({
            earliestTime: date
        });
    }

    onLatestTimeChange = (date) => {
        console.log('onLatestTimeChange', format(date));
        this.setState({
            latestTime: date
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
      this.context.router.replace({ pathname: '/route', query: { isDriver : this.isDriver }})
    }

    render() {
        const props = this.props;
        const earliestTime = this.state.earliestTime
        const latestTime = this.state.latestTime
        const datePicker = (
            <DatePicker
            rootNativeProps={{'data-xx':'yy'}}
            minDate={minDate}
            maxDate={maxDate}
            defaultDate={now}
            mode={'datetime'}
            />
        );

        return (
          <div style={{ margin: '10px 30px' }}>
                <div className="col-xs-12" style={{marginBottom: 50, fontSize: 26, textAlign: "center"}}>
                  Pick up time
                </div>
                <div>
                <PopupDatePicker
                datePicker={datePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={earliestTime}
                mode={"datetime"}
                onDismiss={this.onDismiss}
                onChange={this.onEarliestTimeChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  block>
                  {earliestTime && format(earliestTime) || "Earliest time"}
                </Button>

                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{height: 20}}>
                </div>

                <div>
                <PopupDatePicker
                datePicker={datePicker}
                transitionName="rmc-picker-popup-slide-fade"
                maskTransitionName="rmc-picker-popup-fade"
                title=""
                date={latestTime}
                mode={"datetime"}
                onDismiss={this.onDismiss}
                onChange={this.onLatestTimeChange}
                >
                <Button
                  bsSize="large"
                  onClick={this.show}
                  block>
                  {latestTime && format(latestTime) || "Latest time"}
                </Button>
                </PopupDatePicker>
                </div>

                <div className="col-xs-12" style={{height: 20}}>
                </div>

                <Button
                  bsSize="large" onClick={this.ok} block>
                  {"OK"}
                </Button>
          </div>);
    }
}

TimePage.contextTypes = {
  router: React.PropTypes.func.isRequired
};

export default TimePage
