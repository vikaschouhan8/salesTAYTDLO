import React, { Component } from 'react';
import './Sales.css';

// import StarRatings from 'react-star-ratings';

class Sales extends Component {

    constructor() {
        super();
        this.state = {
            rating: 3,
            limit: 30,
            target: 100,
            achievement: 120,
            ytdsales: 100,
            ytdsalesachievment: 19.6,
            width: 50,
            limitVsOutStandings: 0,
            data: '',
            targetVsAchivement: 0,
            ytd_sales: 0
        }
        this.xyz = ''
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        if (this.xyz == '') {
            this.xyz = this.state.width;
            this.preCheckForProps()
        }
    }
    
    plotPercentageLines(data) {
        // console.log("data length", data.length);
        console.log("data length", data);
        // start
        var newData = {};
        var today = new Date();
        var currMonth = (today.getMonth()) + 1;
        var last_april = (currMonth > 4 ? (today).getFullYear() : (today).getFullYear() - 1) + '-04-01';
        var old_april = (currMonth > 4 ? today.getFullYear() - 1 : today.getFullYear() - 2) + '-04-01'
        var present_day = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var present_day_last_year = today.getFullYear() - 1 + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var customer = {};
        var outstanding = 0;
        var ytd_c = 0, ytd_l = 0;
        var achievement = 0, target = 0;
        data.forEach(function (d, i) {
            // console.log("here", d.value)
            // Get credit limit
            // We are getting credit limit for the whole data
            if (!customer[d['customer_name']]) {
                customer[d['customer_name']] = d['creditlimit']
            }
            // calulate YTD for current year
            if (Date.parse(d.billdate) > Date.parse(last_april) &&
                Date.parse(d.billdate) < Date.parse(present_day)) {
                ytd_c += d.value;
            }
            // calulate YTD for last year
            if (Date.parse(d.billdate) > Date.parse(old_april) &&
                Date.parse(d.billdate) < Date.parse(present_day_last_year)) {
                ytd_l += d.value;
            }
            // calulate Achivement for current year
            if (Date.parse(d.billdate) > Date.parse(last_april)) {
                achievement += d.value;
            } else if (Date.parse(d.billdate) > Date.parse(old_april)) {
                target += d.value;
            }
            // Get outstanding for current year
            outstanding += parseInt(d.outstanding)
        })

        var creditlimit = Object.values(customer).reduce(
            (a, b) => a + b, 0
        );
        creditlimit = parseInt(creditlimit) * 100000;

        var limitVsOutStandings = parseFloat(parseFloat(((creditlimit - outstanding) / creditlimit) * 100).toFixed(2));
        var targetVsAchivement = parseFloat(parseFloat(((achievement - target) / target) * 100).toFixed(2));

        var ytd = parseFloat(parseFloat(((ytd_c - ytd_l) / ytd_l) * 100).toFixed(2));
        
        this.setState({
            ytd_sales: ytd,
            limitVsOutStandings: limitVsOutStandings,
            targetVsAchivement: targetVsAchivement
        })
        // end
    }

    preCheckForProps() {
        if (this.props.chartProps != null) {
            var chartprops = this.props.chartProps.payload.data.records;
            this.plotPercentageLines(chartprops);
        }
    }

    render() {
        return (
            <div className="col-sm-12">
                <div className="box-sale rating-sec row">
                    <div className="sidetitle"><span className="sideheading">Ratings</span></div>
                    <div className="pull-left">
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star checked"></span>
                        <span className="fa fa-star"></span>
                        <span className="fa fa-star"></span>
                    </div>
                    <div className="pull-right">
                        <p className="rating-number-sale">3.00</p>
                    </div>
                </div>
                <div className="box-sale multi-bar-sec row">
                    <div className="sidetitle">
                        <span className="sideheading">Target Vs Achivement</span>
                        {/* <span className="pull-right r-num">{this.state.ytd}</span> */}
                    </div>
                    <div className="progress">
                    {this.state.targetVsAchivement < 0 ? (
                            <div className="progress-bar bg-red" role="progressbar" style={{ width: `${-1 * this.state.targetVsAchivement}%` }}><label className="red-text">{this.state.targetVsAchivement}%</label></div>
                        ) : (
                                this.state.targetVsAchivement == 0 ? (
                                    <div className="progress-bar bg-grey" role="progressbar" style={{ width: `${this.state.targetVsAchivement / 4}%` }}><label className="blue-text">{this.state.targetVsAchivement}%</label></div>
                                ) : (
                                        this.state.targetVsAchivement > 0 && this.state.targetVsAchivement < 100 ? (

                                            <div className="progress-bar bg-blue" role="progressbar" style={{ width: `${this.state.targetVsAchivement}%` }}><label className="green-text">{this.state.targetVsAchivement}%</label></div>
                                        ) : (
                                                <div className="progress-bar bg-green" role="progressbar" style={{ width: `${this.state.targetVsAchivement}%` }}><label className="green-text">{this.state.targetVsAchivement}%</label></div>
                                            )
                                    )
                            )
                        }
                    </div>
                </div>
                <div className="box-sale multi-bar-sec row">
                    <div className="sidetitle">
                        <span className="sideheading">YTD Sales</span>
                        {/* <span className="pull-right r-num">{this.state.ytd}</span> */}
                    </div>
                    <div className="progress">
                    {this.state.ytd_sales < 0 ? (
                            <div className="progress-bar bg-red" role="progressbar" style={{ width: `${-1 * this.state.ytd_sales}%` }}><label className="red-text">{this.state.ytd_sales}%</label></div>
                        ) : (
                                this.state.ytd_sales == 0 ? (
                                    <div className="progress-bar bg-grey" role="progressbar" style={{ width: `${this.state.ytd_sales / 4}%` }}><label className="blue-text">{this.state.ytd_sales}%</label></div>
                                ) : (
                                        this.state.ytd_sales > 0 && this.state.ytd_sales < 100 ? (

                                            <div className="progress-bar bg-blue" role="progressbar" style={{ width: `${this.state.ytd_sales}%` }}><label className="green-text">{this.state.ytd_sales}%</label></div>
                                        ) : (
                                                <div className="progress-bar bg-green" role="progressbar" style={{ width: `${this.state.ytd_sales}%` }}><label className="green-text">{this.state.ytd_sales}%</label></div>
                                            )
                                    )
                            )
                        }
                    </div>
                </div>
                {/*  */}
                <div className="box-sale multi-bar-sec row">
                    <div className="sidetitle">
                        <span className="sideheading">Limit VS Outstanding</span>
                        {/* <span className="pull-right r-num">{this.state.ytd}</span> */}
                    </div>
                    <div className="progress">
                        {this.state.limitVsOutStandings < 0 ? (
                            <div className="progress-bar bg-red" role="progressbar" style={{ width: `${-1 * this.state.limitVsOutStandings}%` }}><label className="red-text">{this.state.limitVsOutStandings}%</label></div>
                        ) : (
                                this.state.limitVsOutStandings == 0 ? (
                                    <div className="progress-bar bg-grey" role="progressbar" style={{ width: `${this.state.limitVsOutStandings / 4}%` }}><label className="blue-text">{this.state.limitVsOutStandings}%</label></div>
                                ) : (
                                        this.state.limitVsOutStandings > 0 && this.state.limitVsOutStandings < 100 ? (

                                            <div className="progress-bar bg-blue" role="progressbar" style={{ width: `${this.state.limitVsOutStandings}%` }}><label className="green-text">{this.state.limitVsOutStandings}%</label></div>
                                        ) : (
                                                <div className="progress-bar bg-green" role="progressbar" style={{ width: `${this.state.limitVsOutStandings}%` }}><label className="green-text">{this.state.limitVsOutStandings}%</label></div>
                                            )
                                    )
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Sales;