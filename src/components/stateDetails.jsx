import React, { Component } from "react";
import { indianstates, statesTestData, districtsDaily } from "./API/index";
import * as Icon from "react-feather";
import FacebookIcon from "@material-ui/icons/Facebook";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import TwitterIcon from "@material-ui/icons/Twitter";
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import QueryBuilderTwoToneIcon from "@material-ui/icons/QueryBuilderTwoTone";
import Switch from "react-switch";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import { format } from "d3";
import { Theme, makeStyles } from "@material-ui/core/styles";
import {
  formatDate,
  formatDateAbsolute,
  commaSeperated,
} from "../utils/common-functions";
import parse from "html-react-parser";
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  Tooltip as Retooltip,
  BarChart,
  Bar,
  XAxis,
} from "recharts";
import StateLinePlot from "./stateLinePlot";
import StateBarPlot from "./stateBarPlot";
import ReactGa from "react-ga";
import { Helmet } from "react-helmet";
import Footer from "./footer";
import ControlledExpansionPanels from "./expansionPanel";
// import DistrictPicker from "./districtPicker";
import MiniBarPlot from "./miniBarPlot";
import MiniStateSparkline from "./miniSateSparkline";
import NotFound from "./notFound";

class StateDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateData: [],
      isLoaded: false,
      zones: null,
      zonesLoaded: false,
      totalStateData: [],
      totalStateDataLoaded: false,
      statesDailyData: [],
      statesDailyDataLoaded: false,
      testData: [],
      testDataLoaded: false,
      districtsDaily: [],
      districtsDailyLoaded: false,
      toggleSwitch: false,
      toggleConfirmed: true,
      toggleActive: false,
      toggleRecovered: false,
      toggleDeceased: false,
      viewTable: false,
      back: true,
      beginning: true,
      twoWeeks: false,
      oneMonth: false,
    };
    this.onSwitch = this.onSwitch.bind(this);
    this.onClickConfirmed = this.onClickConfirmed.bind(this);
    this.onClickActive = this.onClickActive.bind(this);
    this.onClickRecovered = this.onClickRecovered.bind(this);
    this.onClickDeceased = this.onClickDeceased.bind(this);
    this.onViewTable = this.onViewTable.bind(this);
    this.onBack = this.onBack.bind(this);
    this.handleBeginning = this.handleBeginning.bind(this);
    this.handleTwoWeeks = this.handleTwoWeeks.bind(this);
    this.handleOneMonth = this.handleOneMonth.bind(this);
  }

  onSwitch(toggleSwitch) {
    this.setState({ toggleSwitch });
  }

  onClickConfirmed(toggleConfirmed) {
    this.setState({ toggleConfirmed });
  }
  onClickActive(toggleActive) {
    this.setState({ toggleActive });
  }
  onClickRecovered(toggleRecovered) {
    this.setState({ toggleRecovered });
  }
  onClickDeceased(toggleDeceased) {
    this.setState({ toggleDeceased });
  }

  onViewTable(viewTable) {
    this.setState({ viewTable });
  }

  onBack({ back }) {
    this.setState({ back });
  }

  handleBeginning({ beginning }) {
    this.setState({ beginning });
  }
  handleTwoWeeks({ twoWeeks }) {
    this.setState({ twoWeeks });
  }
  handleOneMonth({ oneMonth }) {
    this.setState({ oneMonth });
  }

  handleDistrictChange = async (district) => {
    const stateFullName = {
      AP: "Andhra Pradesh",
      AN: "Andaman and Nicobar Islands",
      AR: "Arunachal Pradesh",
      AS: "Assam",
      BR: "Bihar",
      CH: "Chandigarh",
      CT: "Chhattisgarh",
      DN: "Dadra and Nagar Haveli and Daman and Diu",
      DL: "Delhi",
      GA: "Goa",
      GJ: "Gujarat",
      HP: "Himachal Pradesh",
      HR: "Haryana",
      JH: "Jharkhand",
      JK: "Jammu and Kashmir",
      KA: "Karnataka",
      KL: "Kerala",
      LA: "Ladakh",
      LD: "Lakshadweep",
      MH: "Maharashtra",
      ML: "Meghalaya",
      MN: "Manipur",
      MP: "Madhya Pradesh",
      MZ: "Mizoram",
      NL: "Nagaland",
      OR: "Odisha",
      PB: "Punjab",
      PY: "Puducherry",
      RJ: "Rajasthan",
      SK: "Sikkim",
      TG: "Telangana",
      TN: "Tamil Nadu",
      TR: "Tripura",
      UP: "Uttar Pradesh",
      UT: "Uttarakhand",
      WB: "West Bengal",
      UN: "State Unassigned",
    };
    const requiredDistrictData = this.state.districtsDaily[
      stateFullName[this.props.match.params.stateid.toUpperCase()]
    ][district];

    this.setState({
      requiredDistrictData: requiredDistrictData,
      requiredDistrict: district,
      districtHide: true,
    });
  };

  async componentDidMount() {
    const stateID = [
      "AP",
      "AN",
      "AR",
      "AS",
      "BR",
      "CH",
      "CT",
      "DN",
      "DL",
      "GA",
      "GJ",
      "HP",
      "HR",
      "JH",
      "JK",
      "KA",
      "KL",
      "LA",
      "LD",
      "MH",
      "ML",
      "MN",
      "MP",
      "MZ",
      "NL",
      "OR",
      "PB",
      "PY",
      "RJ",
      "SK",
      "TG",
      "TN",
      "TR",
      "UP",
      "UT",
      "WB",
      "UN",
    ];
    const fetchedStates = await indianstates();
    this.setState({ stateData: fetchedStates, isLoaded: true });

    const requiredData = [];
    fetchedStates.map((item) => {
      if (
        this.props.match.params.stateid.toUpperCase() === item.statecode &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        requiredData.push(item.districtData);
    });
    this.setState({ requiredData });

    const fetchedStateTestData = await statesTestData();
    this.setState({ testData: fetchedStateTestData, testDataLoaded: true });

    const fetchedDistrictsDaily = await districtsDaily();
    this.setState({
      districtsDaily: fetchedDistrictsDaily,
      districtsDailyLoaded: true,
    });

    fetch("https://api.covid19india.org/zones.json").then((res) =>
      res.json().then((json) => {
        this.setState({ zones: json.zones, zonesLoaded: true });
      })
    );

    fetch("https://api.covid19india.org/data.json").then((res) =>
      res.json().then((json) => {
        this.setState({
          totalStateData: json.statewise,
          totalStateDataLoaded: true,
        });
      })
    );
    fetch("https://api.covid19india.org/states_daily.json").then((res) =>
      res.json().then((json) => {
        this.setState({
          statesDailyData: json.states_daily,
          statesDailyDataLoaded: true,
        });
      })
    );
  }

  render() {
    const {
      stateData,
      isLoaded,
      zones,
      zonesLoaded,
      totalStateData,
      totalStateDataLoaded,
      requiredData,
      statesDailyData,
      statesDailyDataLoaded,
      testData,
      testDataLoaded,
      districtsDaily,
      districtsDailyLoaded,
      requiredDistrictData,
      toggleConfirmed,
      toggleActive,
      toggleRecovered,
      toggleDeceased,
      toggleSwitch,
      viewTable,
      back,
      beginning,
      twoWeeks,
      oneMonth,
    } = this.state;

    const stateFullName = {
      AP: "Andhra Pradesh",
      AN: "Andaman and Nicobar Islands",
      AR: "Arunachal Pradesh",
      AS: "Assam",
      BR: "Bihar",
      CH: "Chandigarh",
      CT: "Chhattisgarh",
      DN: "Dadra and Nagar Haveli and Daman and Diu",
      DL: "Delhi",
      GA: "Goa",
      GJ: "Gujarat",
      HP: "Himachal Pradesh",
      HR: "Haryana",
      JH: "Jharkhand",
      JK: "Jammu and Kashmir",
      KA: "Karnataka",
      KL: "Kerala",
      LA: "Ladakh",
      LD: "Lakshadweep",
      MH: "Maharashtra",
      ML: "Meghalaya",
      MN: "Manipur",
      MP: "Madhya Pradesh",
      MZ: "Mizoram",
      NL: "Nagaland",
      OR: "Odisha",
      PB: "Punjab",
      PY: "Puducherry",
      RJ: "Rajasthan",
      SK: "Sikkim",
      TG: "Telangana",
      TN: "Tamil Nadu",
      TR: "Tripura",
      UP: "Uttar Pradesh",
      UT: "Uttarakhand",
      WB: "West Bengal",
      UN: "State Unassigned",
    };

    const months = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const stateID = [
      "AP",
      "AN",
      "AR",
      "AS",
      "BR",
      "CH",
      "CT",
      "DN",
      "DL",
      "GA",
      "GJ",
      "HP",
      "HR",
      "JH",
      "JK",
      "KA",
      "KL",
      "LA",
      "LD",
      "MH",
      "ML",
      "MN",
      "MP",
      "MZ",
      "NL",
      "OR",
      "PB",
      "PY",
      "RJ",
      "SK",
      "TG",
      "TN",
      "TR",
      "UP",
      "UT",
      "WB",
      "UN",
    ];

    if (requiredDistrictData) {
      for (let i = 0; i < requiredDistrictData.length; i++) {
        requiredDistrictData[i].newDate =
          String(requiredDistrictData[i].date.split(/\-/)[2]) +
          " " +
          String(months[Number(requiredDistrictData[i].date.split(/\-/)[1])]);
      }
    }

    const requiredDistricts = [];
    if (
      districtsDailyLoaded &&
      stateID.includes(this.props.match.params.stateid.toUpperCase())
    ) {
      requiredDistricts.push(
        Object.keys(
          districtsDaily[
            stateFullName[this.props.match.params.stateid.toUpperCase()]
          ]
        )
      );
    }

    for (let i = 0; i < statesDailyData.length; i++) {
      statesDailyData[i].newdate =
        statesDailyData[i].date.split(/\-/)[0] +
        " " +
        statesDailyData[i].date.split(/\-/)[1];
    }

    console.log(stateData);

    const confirmedTopDistricts = [];
    stateData.map((item) => {
      if (
        this.props.match.params.stateid.toUpperCase() === item.statecode &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        confirmedTopDistricts.push(item.districtData);
    });
    if (
      isLoaded &&
      toggleConfirmed &&
      stateID.includes(this.props.match.params.stateid.toUpperCase())
    ) {
      confirmedTopDistricts[0].sort(function (x, y) {
        return Number(y.confirmed) - Number(x.confirmed);
      });
    }
    const activeTopDistricts = [];
    stateData.map((item) => {
      if (
        this.props.match.params.stateid.toUpperCase() === item.statecode &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        activeTopDistricts.push(item.districtData);
    });
    if (isLoaded && toggleActive) {
      activeTopDistricts[0].sort(function (x, y) {
        return Number(y.active) - Number(x.active);
      });
    }

    const recoveredTopDistricts = [];
    stateData.map((item) => {
      if (
        this.props.match.params.stateid.toUpperCase() === item.statecode &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        recoveredTopDistricts.push(item.districtData);
    });
    if (isLoaded && toggleRecovered) {
      recoveredTopDistricts[0].sort(function (x, y) {
        return Number(y.recovered) - Number(x.recovered);
      });
    }

    const deceasedTopDistricts = [];
    stateData.map((item) => {
      if (
        this.props.match.params.stateid.toUpperCase() === item.statecode &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        deceasedTopDistricts.push(item.districtData);
    });
    if (isLoaded && toggleDeceased) {
      deceasedTopDistricts[0].sort(function (x, y) {
        return Number(y.deceased) - Number(x.deceased);
      });
    }

    const requiredStateTotalData = [];
    if (totalStateDataLoaded) {
      totalStateData.map((item) => {
        if (this.props.match.params.stateid.toUpperCase() === item.statecode)
          requiredStateTotalData.push(item);
      });
    }

    const requiredConfirmedStateDailyData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Confirmed")
          requiredConfirmedStateDailyData.push(item);
      });
    }

    const date = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Confirmed") date.push(item.newdate);
      });
    }

    const requiredRecoveredStateDailyData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Recovered")
          requiredRecoveredStateDailyData.push(item);
      });
    }

    const requiredDeceasedStateDailyData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Deceased")
          requiredDeceasedStateDailyData.push(item);
      });
    }

    const requiredActiveStateDailyData = [];
    const sparklineDailyActiveData = [];

    const sparklineTotalConfirmedData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Confirmed")
          sparklineTotalConfirmedData.push(
            Number(item[this.props.match.params.stateid.toLowerCase()])
          );
      });
    }

    const barDailyConfirmedData = [];

    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Confirmed" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          barDailyConfirmedData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
            label: Number(item[this.props.match.params.stateid.toLowerCase()]),
          });
      });
    }

    const dailyConfirmed = [];
    const dailyDeltaConfirmed = [];

    for (let i = barDailyConfirmedData.length - 1; i > 0; i--) {
      dailyConfirmed.push(barDailyConfirmedData[i].stateid);
      dailyDeltaConfirmed.push(
        barDailyConfirmedData[i].stateid - barDailyConfirmedData[i - 1].stateid
      );
      if (
        barDailyConfirmedData[i].label - barDailyConfirmedData[i - 1].label >=
          0 &&
        barDailyConfirmedData[i - 1].label > 0
      )
        barDailyConfirmedData[i].label = `+${(
          ((barDailyConfirmedData[i].label -
            barDailyConfirmedData[i - 1].label) /
            barDailyConfirmedData[i - 1].label) *
          100
        ).toFixed(1)}%`;
      if (
        barDailyConfirmedData[i].label - barDailyConfirmedData[i - 1].label <=
          0 &&
        barDailyConfirmedData[i - 1].label > 0
      )
        barDailyConfirmedData[i].label = `${(
          ((barDailyConfirmedData[i].label -
            barDailyConfirmedData[i - 1].label) /
            barDailyConfirmedData[i - 1].label) *
          100
        ).toFixed(1)}%`;
      if (
        barDailyConfirmedData[i - 1].label === 0 &&
        barDailyConfirmedData[i].label !== 0
      )
        barDailyConfirmedData[i].label = "+100.0%";
      if (
        barDailyConfirmedData[i - 1].label === 0 &&
        barDailyConfirmedData[i].label === 0
      )
        barDailyConfirmedData[i].label = "+0%";
    }

    const lineTotalConfirmedData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (item.status === "Confirmed")
          lineTotalConfirmedData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
          });
      });
    }
    for (let i = 1; i <= lineTotalConfirmedData.length - 1; i++) {
      lineTotalConfirmedData[i].stateid =
        lineTotalConfirmedData[i].stateid +
        lineTotalConfirmedData[i - 1].stateid;
    }

    const sparklineDailyRecoveredData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Recovered" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          sparklineDailyRecoveredData.push(
            Number(item[this.props.match.params.stateid.toLowerCase()])
          );
      });
    }

    const barDailyRecoveredData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Recovered" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          barDailyRecoveredData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
            label: Number(item[this.props.match.params.stateid.toLowerCase()]),
          });
      });
    }

    const dailyRecovered = [];
    const dailyDeltaRecovered = [];

    for (let i = barDailyRecoveredData.length - 1; i > 0; i--) {
      dailyRecovered.push(barDailyRecoveredData[i].stateid);
      dailyDeltaRecovered.push(
        barDailyRecoveredData[i].stateid - barDailyRecoveredData[i - 1].stateid
      );
      if (
        barDailyRecoveredData[i].label - barDailyRecoveredData[i - 1].label >=
          0 &&
        barDailyRecoveredData[i - 1].label > 0
      )
        barDailyRecoveredData[i].label = `+${(
          ((barDailyRecoveredData[i].label -
            barDailyRecoveredData[i - 1].label) /
            barDailyRecoveredData[i - 1].label) *
          100
        ).toFixed(1)}%`;
      if (
        barDailyRecoveredData[i].label - barDailyRecoveredData[i - 1].label <=
          0 &&
        barDailyRecoveredData[i - 1].label > 0
      )
        barDailyRecoveredData[i].label = `${(
          ((barDailyRecoveredData[i].label -
            barDailyRecoveredData[i - 1].label) /
            barDailyRecoveredData[i - 1].label) *
          100
        ).toFixed(1)}%`;
      if (
        barDailyRecoveredData[i - 1] === 0 &&
        Number(barDailyRecoveredData[i]) !== 0
      )
        barDailyRecoveredData[i] = "+100.0%";
      if (barDailyRecoveredData[i - 1] === 0 && barDailyRecoveredData[i] === 0)
        barDailyRecoveredData[i] = "+0%";
    }

    const lineTotalRecoveredData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Recovered" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          lineTotalRecoveredData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
          });
      });
    }
    for (let i = 1; i <= lineTotalRecoveredData.length - 1; i++) {
      lineTotalRecoveredData[i].stateid =
        lineTotalRecoveredData[i].stateid +
        lineTotalRecoveredData[i - 1].stateid;
    }

    const sparklineDailyDeceasedData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Deceased" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          sparklineDailyDeceasedData.push(
            Number(item[this.props.match.params.stateid.toLowerCase()])
          );
      });
    }

    for (let i = 0; i < sparklineTotalConfirmedData.length; i++) {
      sparklineDailyActiveData.push(
        sparklineTotalConfirmedData[i] -
          sparklineDailyRecoveredData[i] -
          sparklineDailyDeceasedData[i]
      );
      requiredActiveStateDailyData.push({
        stateid:
          sparklineTotalConfirmedData[i] -
          sparklineDailyRecoveredData[i] -
          sparklineDailyDeceasedData[i],
      });
    }

    const barDailyDeceasedData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Deceased" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          barDailyDeceasedData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
            label: Number(item[this.props.match.params.stateid.toLowerCase()]),
          });
      });
    }

    const dailyDeceased = [];
    const dailyDeltaDeceased = [];

    for (let i = barDailyDeceasedData.length - 1; i > 0; i--) {
      dailyDeceased.push(barDailyDeceasedData[i].stateid);
      dailyDeltaDeceased.push(
        barDailyDeceasedData[i].stateid - barDailyDeceasedData[i - 1].stateid
      );

      if (
        barDailyDeceasedData[i].label - barDailyDeceasedData[i - 1].label >=
          0 &&
        barDailyDeceasedData[i - 1].label > 0
      )
        barDailyDeceasedData[i].label = `+${(
          ((barDailyDeceasedData[i].label - barDailyDeceasedData[i - 1].label) /
            barDailyDeceasedData[i - 1].label) *
          100
        ).toFixed(1)}%`;
      if (
        barDailyDeceasedData[i].label - barDailyDeceasedData[i - 1].label <=
          0 &&
        barDailyDeceasedData[i - 1].label > 0
      )
        barDailyDeceasedData[i].label = `${(
          ((barDailyDeceasedData[i].label - barDailyDeceasedData[i - 1].label) /
            barDailyDeceasedData[i - 1].label) *
          100
        ).toFixed(1)}%`;

      if (
        barDailyDeceasedData[i - 1].label === 0 &&
        barDailyDeceasedData[i].label !== 0
      )
        barDailyDeceasedData[i].label = "+100.0%";

      if (
        barDailyDeceasedData[i - 1].label === 0 &&
        barDailyDeceasedData[i].label === 0
      )
        barDailyDeceasedData[i].label = "+0%";
    }

    const lineTotalDeceasedData = [];
    if (statesDailyDataLoaded) {
      statesDailyData.map((item) => {
        if (
          item.status === "Deceased" &&
          stateID.includes(this.props.match.params.stateid.toUpperCase())
        )
          lineTotalDeceasedData.push({
            stateid: Number(
              item[this.props.match.params.stateid.toLowerCase()]
            ),
            date: item.newdate,
          });
      });
    }
    for (let i = 1; i <= lineTotalDeceasedData.length - 1; i++) {
      lineTotalDeceasedData[i].stateid =
        lineTotalDeceasedData[i].stateid + lineTotalDeceasedData[i - 1].stateid;
    }

    const lineTotalActiveData = [];
    for (let i = 0; i <= lineTotalDeceasedData.length - 1; i++) {
      lineTotalActiveData.push({
        stateid:
          Number(lineTotalConfirmedData[i].stateid) -
          Number(lineTotalRecoveredData[i].stateid) -
          Number(lineTotalDeceasedData[i].stateid),
        date: lineTotalConfirmedData[i].date,
      });
    }

    const barDailyActiveData = [];
    for (let i = 0; i <= barDailyDeceasedData.length - 1; i++)
      barDailyActiveData.push({
        stateid:
          Number(barDailyConfirmedData[i].stateid) -
          Number(barDailyRecoveredData[i].stateid) -
          Number(barDailyDeceasedData[i].stateid),
        date: barDailyRecoveredData[i].date,
      });

    const maxConfirmed = Math.max(
      ...sparklineTotalConfirmedData.slice(
        sparklineTotalConfirmedData.length - 20,
        sparklineTotalConfirmedData.length
      )
    );
    const maxActive = Math.max(
      ...sparklineDailyActiveData.slice(
        sparklineDailyActiveData.length - 20,
        sparklineDailyActiveData.length
      )
    );
    const maxRecovered = Math.max(
      ...sparklineDailyRecoveredData.slice(
        sparklineDailyRecoveredData.length - 20,
        sparklineDailyRecoveredData.length
      )
    );
    const maxDeceased = Math.max(
      ...sparklineDailyDeceasedData.slice(
        sparklineDailyDeceasedData.length - 20,
        sparklineDailyDeceasedData.length
      )
    );

    const minConfirmed = Math.min(
      ...sparklineTotalConfirmedData.slice(
        sparklineTotalConfirmedData.length - 20,
        sparklineTotalConfirmedData.length
      )
    );
    const minActive = Math.min(
      ...sparklineDailyActiveData.slice(
        sparklineDailyActiveData.length - 20,
        sparklineDailyActiveData.length
      )
    );
    const minRecovered = Math.min(
      ...sparklineDailyRecoveredData.slice(
        sparklineDailyRecoveredData.length - 20,
        sparklineDailyRecoveredData.length
      )
    );
    const minDeceased = Math.min(
      ...sparklineDailyDeceasedData.slice(
        sparklineDailyDeceasedData.length - 20,
        sparklineDailyDeceasedData.length
      )
    );

    const max = Math.max(maxConfirmed, maxActive, maxRecovered, maxDeceased);
    const min = Math.min(minConfirmed, minActive, minRecovered, minDeceased);

    const requiredStateTestData = [];
    testData.map((item) => {
      if (
        item.state ===
          stateFullName[this.props.match.params.stateid.toUpperCase()] &&
        this.props.match.params.stateid.toUpperCase() !== "LD" &&
        stateID.includes(this.props.match.params.stateid.toUpperCase())
      )
        requiredStateTestData.push(item);
    });

    for (let i = 0; i < requiredStateTestData.length; i++) {
      requiredStateTestData[i].date =
        requiredStateTestData[i].updatedon.split(/\//)[0] +
        " " +
        months[Number(requiredStateTestData[i].updatedon.split(/\//)[1])];
    }

    const expansionPanelData = [];
    const expansionPanelDataPopulation = [];

    for (let i = requiredStateTestData.length - 1; i >= 0; i--) {
      if (requiredStateTestData[i].totaltested) {
        expansionPanelData.push(requiredStateTestData[i]);
        break;
      }
    }
    for (let i = requiredStateTestData.length - 1; i >= 0; i--) {
      if (requiredStateTestData[i].populationncp2019projection) {
        expansionPanelDataPopulation.push(
          requiredStateTestData[i].populationncp2019projection
        );
        break;
      }
    }

    const cumulativeTestDataArray = [];
    const cumulativeTestDataDateArray = [];

    requiredStateTestData.map((item) => {
      cumulativeTestDataArray.push(Number(item.totaltested));
      cumulativeTestDataDateArray.push(item.date);
    });

    const dateFormattedTestData = [];

    for (let i = 0; i < date.length; i++) {
      if (cumulativeTestDataDateArray.includes(date[i])) {
        const index = cumulativeTestDataDateArray.indexOf(date[i]);
        if (cumulativeTestDataArray[index]) {
          dateFormattedTestData.push({
            totaltested: cumulativeTestDataArray[index],
            date: date[i],
          });
        } else
          dateFormattedTestData.push({
            totaltested: "-",
            date: date[i],
          });
      } else dateFormattedTestData.push({ totaltested: "-", date: date[i] });
    }

    const formattedTestData = [];
    for (let i = 0; i < date.length; i++) {
      if (cumulativeTestDataDateArray.includes(date[i])) {
        const index = cumulativeTestDataDateArray.indexOf(date[i]);
        formattedTestData.push({
          totaltested: cumulativeTestDataArray[index],
          date: date[i],
        });
      } else formattedTestData.push({ totaltested: 0, date: date[i] });
    }

    const dailyFormattedTestData = [];
    let previousData = 0;

    for (let i = 0; i < formattedTestData.length; i++) {
      if (i === 0)
        dailyFormattedTestData.push({
          dailytested: formattedTestData[i].totaltested,
          date: formattedTestData[i].date,
        });
      else {
        if (
          formattedTestData[i].totaltested &&
          formattedTestData[i - 1].totaltested
        ) {
          dailyFormattedTestData.push({
            dailytested:
              formattedTestData[i].totaltested -
              formattedTestData[i - 1].totaltested,
            date: formattedTestData[i].date,
          });
          previousData = formattedTestData[i].totaltested;
        } else if (
          formattedTestData[i].totaltested === 0 &&
          formattedTestData[i - 1].totaltested === 0
        ) {
          dailyFormattedTestData.push({
            dailytested: 0,
            date: formattedTestData[i].date,
          });
        } else if (
          formattedTestData[i].totaltested !== 0 &&
          formattedTestData[i - 1].totaltested === 0
        ) {
          dailyFormattedTestData.push({
            dailytested: formattedTestData[i].totaltested - previousData,
            date: formattedTestData[i].date,
          });
          previousData = formattedTestData[i].totaltested;
        } else if (
          formattedTestData[i].totaltested === 0 &&
          formattedTestData[i - 1].totaltested !== 0
        ) {
          dailyFormattedTestData.push({
            dailytested: 0,
            date: formattedTestData[i].date,
          });
        }
      }
    }

    const useStylesBootstrap = makeStyles((theme: Theme) => ({
      arrow: {
        color: theme.palette.common.black,
      },
      tooltip: {
        backgroundColor: theme.palette.common.black,
      },
    }));

    function BootstrapTooltip(props: TooltipProps) {
      const classes = useStylesBootstrap();

      return (
        <Tooltip disableTouchListener arrow classes={classes} {...props} />
      );
    }

    function districtZone(district) {
      const redZone = [];
      const orangeZone = [];
      const greenZone = [];
      if (zonesLoaded) {
        zones.map((item) => {
          if (item.zone === "Red") redZone.push(item.district);
        });
        zones.map((item) => {
          if (item.zone === "Orange") orangeZone.push(item.district);
        });
        zones.map((item) => {
          if (item.zone === "Green") greenZone.push(item.district);
        });
      }

      if (redZone.includes(district)) {
        return "#ff446a";
      }
      if (orangeZone.includes(district)) {
        return "rgb(255, 153, 0)";
      }
      if (greenZone.includes(district)) {
        return "rgb(40, 167, 69)";
      } else return "rgb(150, 150, 150)";
    }

    let timelineLength = 0;

    if (isLoaded) {
      if (beginning) {
        timelineLength = 0;
      }
      if (twoWeeks) {
        timelineLength = lineTotalConfirmedData.length - 15;
      }
      if (oneMonth) {
        timelineLength = lineTotalConfirmedData.length - 30;
      }
    }

    if (
      isLoaded &&
      zonesLoaded &&
      totalStateDataLoaded &&
      statesDailyDataLoaded &&
      testDataLoaded &&
      stateID.includes(this.props.match.params.stateid.toUpperCase())
    ) {
      return (
        <React.Fragment>
          <div className="container">
            <Helmet>
              <title>
                {stateFullName[this.props.match.params.stateid.toUpperCase()]}{" "}
                Covid Dashboard
              </title>
              <meta
                name="description"
                content={`Track the spread of Coronavirus (COVID-19) in ${
                  stateFullName[this.props.match.params.stateid.toUpperCase()]
                }`}
              />
            </Helmet>
            <div className="row fadeInUp" style={{ animationDelay: "0.4s" }}>
              <div className="col-7" style={{ marginTop: 12 }}>
                <h5
                  style={{
                    fontFamily: "notosans",
                    textTransform: "uppercase",
                    textAlign: "left",
                    color: "rgb(226, 42, 79)",
                  }}
                >
                  {stateFullName[this.props.match.params.stateid.toUpperCase()]}
                  <BootstrapTooltip
                    title={"Data tallied with State bulletins, MoHFW and ICMR"}
                  >
                    <span>
                      <InfoTwoToneIcon
                        color="inherit"
                        fontSize="small"
                        style={{ verticalAlign: "-0.15rem" }}
                      />
                    </span>
                  </BootstrapTooltip>
                </h5>
              </div>
              <div className="col-5" style={{ marginTop: 12 }}>
                <h6
                  style={{
                    fontFamily: "notosans",
                    textTransform: "uppercase",
                    textAlign: "right",
                    color: "rgba(62, 77, 163, 0.8)",
                    fontSize: 10,
                  }}
                >
                  <span style={{ verticalAlign: "0.1rem", cursor: "pointer" }}>
                    <QueryBuilderTwoToneIcon
                      color="primary"
                      fontSize="inherit"
                    />
                  </span>{" "}
                  {isNaN(
                    Date.parse(
                      formatDate(requiredStateTotalData[0].lastupdatedtime)
                    )
                  )
                    ? ""
                    : formatDateAbsolute(
                        requiredStateTotalData[0].lastupdatedtime
                      )}
                </h6>
              </div>
              <div className="w-100"></div>

              <div
                className="col fadeInUp"
                style={{ alignContent: "center", animationDelay: "0.6s" }}
              >
                <div className="row" style={{ marginBottom: -5 }}>
                  <div className="col-7" style={{ textAlign: "left" }}>
                    <h6 style={{ fontSize: 10, color: "#3e4da3" }}>
                      Total samples tested:{" "}
                      {expansionPanelData[0] === undefined
                        ? "0"
                        : commaSeperated(expansionPanelData[0].totaltested)}
                    </h6>
                  </div>
                  <div className="col-5" style={{ textAlign: "right" }}>
                    <h6 style={{ fontSize: 9, color: "#3e4da3" }}>
                      {expansionPanelData[0] !== undefined
                        ? `as of ${expansionPanelData[0].date}`
                        : ""}
                    </h6>
                  </div>
                </div>

                <table
                  className="table-borderless table table-sm fadeInUp"
                  style={{ animationDelay: "0.4s" }}
                >
                  <tr className="tr">
                    <td
                      className="td stateTable"
                      style={{
                        textAlign: "center",
                        width: "25%",
                        borderBottom: `${
                          toggleConfirmed
                            ? "solid rgba(10, 111, 145, 0.8) 7px"
                            : ""
                        }`,
                      }}
                      onClick={() => {
                        this.setState({
                          toggleConfirmed: true,
                          toggleActive: false,
                          toggleRecovered: false,
                          toggleDeceased: false,
                        });
                      }}
                    >
                      <h6
                        className="text-info"
                        style={{ fontSize: "0.8rem", background: "#d9ecf5" }}
                      >
                        CONFIRMED
                      </h6>
                      <h6
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(23, 162, 184, 0.7)",
                        }}
                      >
                        +
                        {commaSeperated(
                          requiredStateTotalData[0].deltaconfirmed
                        )}
                      </h6>
                      <h5 className="text-info">
                        {commaSeperated(requiredStateTotalData[0].confirmed)}
                      </h5>
                      <MiniStateSparkline
                        requiredStateDailyData={requiredConfirmedStateDailyData}
                        dataKey={this.props.match.params.stateid.toLowerCase()}
                        min={min}
                        max={max}
                        sparklineData={sparklineTotalConfirmedData}
                        stroke="#42b3f4"
                      />
                    </td>
                    <td
                      className="td stateTable"
                      style={{
                        textAlign: "center",
                        width: "25%",
                        borderBottom: `${
                          toggleActive ? "solid rgba(201, 25, 60, 0.8) 7px" : ""
                        }`,
                      }}
                      onClick={() => {
                        this.setState({
                          toggleConfirmed: false,
                          toggleActive: true,
                          toggleRecovered: false,
                          toggleDeceased: false,
                        });
                      }}
                    >
                      <h6
                        style={{
                          fontSize: "0.8rem",
                          color: "#ff446a",
                          background: "#f5d2d2",
                        }}
                      >
                        ACTIVE
                      </h6>
                      <h6
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(255, 68, 106, 0.7)",
                        }}
                      >
                        {Number(requiredStateTotalData[0].confirmed)
                          ? (
                              (requiredStateTotalData[0].active /
                                requiredStateTotalData[0].confirmed) *
                              100
                            ).toFixed(2)
                          : "0"}
                        %
                      </h6>
                      <h5 style={{ color: "#ff446a" }}>
                        {commaSeperated(requiredStateTotalData[0].active)}
                      </h5>
                      <MiniStateSparkline
                        requiredStateDailyData={requiredActiveStateDailyData}
                        dataKey="stateid"
                        min={min}
                        max={max}
                        sparklineData={sparklineDailyActiveData}
                        stroke="#ff446a"
                      />
                    </td>
                    <td
                      className="td stateTable"
                      style={{
                        textAlign: "center",
                        width: "25%",
                        borderBottom: `${
                          toggleRecovered
                            ? "solid rgba(64, 145, 64, 0.8) 7px"
                            : ""
                        }`,
                      }}
                      onClick={() => {
                        this.setState({
                          toggleConfirmed: false,
                          toggleActive: false,
                          toggleRecovered: true,
                          toggleDeceased: false,
                        });
                      }}
                    >
                      <h6
                        className="text-success"
                        style={{ fontSize: "0.8rem", background: "#d5e9d5" }}
                      >
                        RECOVERED
                      </h6>
                      <h6
                        style={{
                          color: "rgba(40, 167, 69, 0.7)",
                          fontSize: "0.8rem",
                        }}
                      >
                        +
                        {commaSeperated(
                          requiredStateTotalData[0].deltarecovered
                        )}
                      </h6>
                      <h5 className="text-success">
                        {commaSeperated(requiredStateTotalData[0].recovered)}
                      </h5>
                      <MiniStateSparkline
                        requiredStateDailyData={requiredRecoveredStateDailyData}
                        dataKey={this.props.match.params.stateid.toLowerCase()}
                        min={min}
                        max={max}
                        sparklineData={sparklineDailyRecoveredData}
                        stroke="#58bd58"
                      />
                    </td>
                    <td
                      className="td stateTable"
                      style={{
                        textAlign: "center",
                        width: "25%",
                        borderBottom: `${
                          toggleDeceased ? "solid rgb(74, 79, 83) 7px" : ""
                        }`,
                      }}
                      onClick={() => {
                        this.setState({
                          toggleConfirmed: false,
                          toggleActive: false,
                          toggleRecovered: false,
                          toggleDeceased: true,
                        });
                      }}
                    >
                      <h6
                        className="text-secondary"
                        style={{ fontSize: "0.8rem", background: "#ece7e7" }}
                      >
                        DECEASED
                      </h6>
                      <h6
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(108, 117, 125, 0.7)",
                        }}
                      >
                        +{commaSeperated(requiredStateTotalData[0].deltadeaths)}
                      </h6>
                      <h5 className="text-secondary">
                        {commaSeperated(requiredStateTotalData[0].deaths)}
                      </h5>
                      <MiniStateSparkline
                        requiredStateDailyData={requiredDeceasedStateDailyData}
                        dataKey={this.props.match.params.stateid.toLowerCase()}
                        min={min}
                        max={max}
                        sparklineData={sparklineDailyDeceasedData}
                        stroke="#5c5756"
                      />
                    </td>
                  </tr>
                </table>

                <div className="w-100"></div>
                <div className="row">
                  <div
                    className="col-6 fadeInUp"
                    style={{ transitionDelay: "0.9s" }}
                  >
                    {<br id="line2" />}
                    {<br id="line2" />}
                    {isLoaded && toggleConfirmed ? (
                      <div>
                        <h6
                          style={{
                            color: "rgba(62, 77, 163, 0.7)",
                            fontWeight: 700,
                          }}
                        >
                          TOP DISTRICTS
                        </h6>
                        <ul>
                          {confirmedTopDistricts.map((item) =>
                            item.slice(0, 5).map((district) => (
                              <li
                                key={district.district}
                                style={{
                                  color: `${districtZone(district.district)}`,
                                  fontWeight: 600,
                                  fontSize: 12,
                                  fontFamily: "notosans",
                                }}
                              >
                                {commaSeperated(district.confirmed)}{" "}
                                <span style={{ fontSize: 11 }}>
                                  {district.district}
                                </span>
                                &nbsp;
                                <span
                                  style={{
                                    color: "rgba(66, 179, 244, 0.9)",
                                    fontSize: 11,
                                  }}
                                >
                                  {district.delta.confirmed ? (
                                    <Icon.ArrowUp size={11} strokeWidth={3} />
                                  ) : (
                                    ""
                                  )}
                                  {district.delta.confirmed
                                    ? district.delta.confirmed
                                    : ""}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                    {isLoaded && toggleActive ? (
                      <div>
                        <h6 style={{ color: "rgba(62, 77, 163, 0.7)" }}>
                          TOP DISTRICTS
                        </h6>
                        <ul>
                          {activeTopDistricts.map((item) =>
                            item.slice(0, 5).map((district) => (
                              <li
                                key={district.district}
                                style={{
                                  color: `${districtZone(district.district)}`,
                                  fontWeight: 600,
                                  fontSize: 12,
                                  fontFamily: "notosans",
                                }}
                              >
                                {commaSeperated(district.active)}{" "}
                                <span style={{ fontSize: 11 }}>
                                  {district.district}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}

                    {isLoaded && toggleRecovered ? (
                      <div>
                        <h6 style={{ color: "rgba(62, 77, 163, 0.7)" }}>
                          TOP DISTRICTS
                        </h6>
                        <ul>
                          {recoveredTopDistricts.map((item) =>
                            item.slice(0, 5).map((district) => (
                              <li
                                key={district.district}
                                style={{
                                  color: `${districtZone(district.district)}`,
                                  fontWeight: 600,
                                  fontSize: 12,
                                  fontFamily: "notosans",
                                }}
                              >
                                {commaSeperated(district.recovered)}{" "}
                                <span style={{ fontSize: 11 }}>
                                  {district.district}
                                </span>
                                &nbsp;
                                <span
                                  style={{
                                    color: "rgba(88, 189, 88, 0.9)",
                                    fontSize: 11,
                                  }}
                                >
                                  {district.delta.recovered ? (
                                    <Icon.ArrowUp size={11} strokeWidth={3} />
                                  ) : (
                                    ""
                                  )}
                                  {district.delta.recovered
                                    ? district.delta.recovered
                                    : ""}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                    {isLoaded && toggleDeceased ? (
                      <div>
                        <h6 style={{ color: "rgba(62, 77, 163, 0.7)" }}>
                          TOP DISTRICTS
                        </h6>
                        <ul>
                          {deceasedTopDistricts.map((item) =>
                            item.slice(0, 5).map((district) => (
                              <li
                                key={district.district}
                                style={{
                                  color: `${districtZone(district.district)}`,
                                  fontWeight: 600,
                                  fontFamily: "notosans",
                                  fontSize: 12,
                                }}
                              >
                                {district.deceased}{" "}
                                <span style={{ fontSize: 11 }}>
                                  {district.district}
                                </span>
                                &nbsp;
                                <span
                                  style={{
                                    color: "rgba(74, 79, 83, 0.8)",
                                    fontSize: 11,
                                  }}
                                >
                                  {district.delta.deceased ? (
                                    <Icon.ArrowUp size={11} strokeWidth={3} />
                                  ) : (
                                    ""
                                  )}
                                  {district.delta.deceased
                                    ? district.delta.deceased
                                    : ""}
                                </span>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-6">
                    {toggleConfirmed && (
                      <MiniBarPlot
                        barDailyData={barDailyConfirmedData}
                        type="confirmed"
                        fill="rgb(16, 133, 172)"
                      />
                    )}

                    {toggleActive && (
                      <MiniBarPlot
                        barDailyData={barDailyActiveData}
                        type="active"
                        fill="rgb(211, 25, 60)"
                      />
                    )}

                    {toggleRecovered && (
                      <MiniBarPlot
                        barDailyData={barDailyRecoveredData}
                        type="recovered"
                        fill="rgb(64, 145, 64)"
                      />
                    )}

                    {toggleDeceased && (
                      <MiniBarPlot
                        barDailyData={barDailyDeceasedData}
                        type="deceased"
                        fill="#474646"
                      />
                    )}
                  </div>
                </div>
                <div className="w-100"></div>
                <div className="row">
                  <div
                    className="col fadeInUp"
                    style={{
                      paddingLeft: "3.2%",
                      paddingRight: "3.2%",
                      animationDelay: "1s",
                    }}
                  >
                    <ControlledExpansionPanels
                      data={expansionPanelData}
                      stateData={requiredStateTotalData}
                      state={
                        stateFullName[
                          this.props.match.params.stateid.toUpperCase()
                        ]
                      }
                      population={expansionPanelDataPopulation}
                    />
                  </div>
                </div>
                <div className="w-100"></div>
                <div className="row fadeInUp" style={{ animationDelay: "1s" }}>
                  <div className="col">
                    {back && (
                      <h6
                        className="btnViewAll"
                        onClick={() => {
                          this.setState({ viewTable: true, back: false });
                          ReactGa.event({
                            category: "View Button",
                            action: "View Button Clicked",
                          });
                        }}
                      >
                        VIEW ALL DISTRICTS{" "}
                        <Icon.ArrowDownCircle
                          size={12}
                          style={{ verticalAlign: "-0.1rem" }}
                        />
                      </h6>
                    )}
                  </div>
                </div>
                <div className="w-100"></div>
                <div className="col">
                  {requiredData.length && viewTable ? (
                    <React.Fragment>
                      <div className="col">
                        <h6
                          className="btnBackAll"
                          onClick={() => {
                            this.setState({ viewTable: false, back: true });
                          }}
                        >
                          HIDE ALL DISTRICTS{" "}
                          <Icon.ArrowUpCircle
                            size={12}
                            style={{ verticalAlign: "-0.1rem" }}
                          />
                        </h6>
                      </div>
                      <div className="w-100"></div>
                      <div
                        className="row fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <table
                          className="table table-sm table-striped table-borderless"
                          style={{
                            minWidth: "290px",
                            tableLayout: "fixed",
                            width: "100%",
                          }}
                          align="center"
                        >
                          <thead className="thead-dark">
                            <tr>
                              <th
                                className="th wideRow sticky-top"
                                id="line1"
                                style={{ width: "57px" }}
                              >
                                DISTRICT
                              </th>
                              <th
                                className="th sticky-top"
                                id="line2"
                                style={{ width: "175px" }}
                              >
                                DISTRICT
                              </th>
                              <th
                                className="th sticky-top text-info smallRow"
                                style={{ textAlign: "center" }}
                                id="line1"
                              >
                                CNFRMD
                              </th>
                              <th
                                className="th sticky-top text-info"
                                style={{ textAlign: "center" }}
                                id="line2"
                              >
                                CONFIRMED
                              </th>
                              <th
                                className="th sticky-top smallRow"
                                style={{
                                  color: "rgb(255, 68, 106)",
                                  textAlign: "center",
                                }}
                                id="line1"
                              >
                                ACTIVE
                              </th>
                              <th
                                className="th sticky-top narrowRow"
                                style={{
                                  color: "rgb(255, 68, 106)",
                                  textAlign: "center",
                                }}
                                id="line2"
                              >
                                ACTIVE
                              </th>
                              <th
                                className="th sticky-top text-success smallRow"
                                style={{ textAlign: "center" }}
                                id="line1"
                              >
                                RCVRD
                              </th>
                              <th
                                className="th sticky-top text-success"
                                style={{ textAlign: "center" }}
                                id="line2"
                              >
                                RECOVERED
                              </th>
                              <th
                                className="th sticky-top text-secondary smallRow"
                                id="line1"
                                style={{ textAlign: "center" }}
                              >
                                DEATHS
                              </th>
                              <th
                                className="th sticky-top text-secondary"
                                id="line2"
                                style={{ textAlign: "center", width: "70px" }}
                              >
                                DECEASED
                              </th>
                            </tr>
                          </thead>
                          <tbody className="tbody">
                            {requiredData.map((item) =>
                              item.map((district) => (
                                <tr className="tr">
                                  <td
                                    className="tdleft align-middle"
                                    style={{
                                      color: `${districtZone(
                                        district.district
                                      )}`,
                                      borderLeftWidth: "5px",
                                      borderStyle: "solid",
                                    }}
                                  >
                                    {district.district}
                                    {district.notes ? (
                                      <BootstrapTooltip
                                        title={parse(district.notes)}
                                      >
                                        <span
                                          style={{ verticalAlign: "0.05rem" }}
                                        >
                                          <InfoTwoToneIcon
                                            color="inherit"
                                            fontSize="inherit"
                                          />
                                        </span>
                                      </BootstrapTooltip>
                                    ) : (
                                      ""
                                    )}
                                  </td>
                                  <td
                                    className="delta td text-secondary align-middle"
                                    style={{ textAlign: "right" }}
                                  >
                                    <span className="arrowup text-info">
                                      {Number(district.delta.confirmed) !==
                                        0 && (
                                        <Icon.ArrowUp
                                          color="#42b3f4"
                                          size={9}
                                          strokeWidth={3.5}
                                        />
                                      )}
                                      <b className="deltainc-md text-info">
                                        {Number(district.delta.confirmed) === 0
                                          ? ""
                                          : commaSeperated(
                                              district.delta.confirmed
                                            )}
                                      </b>
                                    </span>
                                    &nbsp;&nbsp;
                                    {commaSeperated(district.confirmed)}
                                  </td>
                                  <td
                                    className="delta td text-secondary narrowRow align-middle"
                                    style={{ textAlign: "right" }}
                                  >
                                    {Number(district.active)
                                      ? commaSeperated(district.active)
                                      : "-"}
                                  </td>
                                  <td
                                    className="delta td text-secondary align-middle"
                                    style={{ textAlign: "right" }}
                                  >
                                    <span className="arrowup text-success">
                                      {Number(district.delta.recovered) !==
                                        0 && (
                                        <Icon.ArrowUp
                                          color="#28a745"
                                          size={9}
                                          strokeWidth={3.5}
                                        />
                                      )}
                                      <b className="deltainc-md text-success align-middle">
                                        {Number(district.delta.recovered) === 0
                                          ? ""
                                          : commaSeperated(
                                              district.delta.recovered
                                            )}
                                      </b>
                                    </span>
                                    &nbsp;&nbsp;
                                    {Number(district.recovered)
                                      ? commaSeperated(district.recovered)
                                      : "-"}
                                  </td>
                                  <td
                                    className="delta td text-secondary narrowRow align-middle"
                                    style={{ textAlign: "right" }}
                                  >
                                    <span className="arrowup text-secondary">
                                      {Number(district.delta.deceased) !==
                                        0 && (
                                        <Icon.ArrowUp
                                          color="#6c757d"
                                          size={9}
                                          strokeWidth={3.5}
                                        />
                                      )}
                                      <b className="deltainc-md text-secondary align-middle">
                                        {Number(district.delta.deceased) === 0
                                          ? ""
                                          : commaSeperated(
                                              district.delta.deceased
                                            )}
                                      </b>
                                    </span>
                                    &nbsp;&nbsp;
                                    {Number(district.deceased)
                                      ? commaSeperated(district.deceased)
                                      : "-"}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </React.Fragment>
                  ) : (
                    <div className="row" style={{ alignContent: "center" }}>
                      <div
                        align="center"
                        className="col-7 fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <h6 className="feedbackBtn">
                          <a
                            href="https://forms.gle/N6V7VTgcmBtxkU4Q9"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Provide us your valuable feedback"
                            style={{ color: "rgb(59, 89, 152)" }}
                          >
                            <Icon.FileText size={19} />{" "}
                          </a>
                        </h6>
                        <h6 className="feedbackBtn">Feedback</h6>
                      </div>
                      <div
                        className="col-5 fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <div className="row shareBtn">
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=covidindiastats.com/${this.props.match.params.stateid.toUpperCase()}`}
                            onClick={() => {
                              ReactGa.event({
                                category: "FB Share",
                                action: "fb clicked",
                              });
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share COVID INDIA STATS on Facebook"
                            style={{ color: "rgb(59, 89, 152)" }}
                          >
                            <FacebookIcon size="inherit" />
                          </a>
                          <a
                            href={`whatsapp://send?text=covidindiastats.com/${this.props.match.params.stateid.toUpperCase()}`}
                            onClick={() => {
                              ReactGa.event({
                                category: "WA Share",
                                action: "wa clicked",
                              });
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share COVID INDIA STATS on Whatsapp"
                            style={{ color: "#25D366" }}
                          >
                            <WhatsAppIcon size="inherit" />
                          </a>
                          <a
                            href={`https://twitter.com/share?url=covidindiastats.com/${this.props.match.params.stateid.toUpperCase()}`}
                            onClick={() => {
                              ReactGa.event({
                                category: "Twitter Share",
                                action: "T clicked",
                              });
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Share COVID INDIA STATS on Twitter"
                            style={{ color: "#00ACEE" }}
                          >
                            <TwitterIcon size="inherit" />
                          </a>
                          <h6 className="likeShare">Like it, Share</h6>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-100"></div>
                {/* <div className="row">
                  <div className="col">
                    <DistrictPicker
                      districts={requiredDistricts[0]}
                      isLoaded={districtsDailyLoaded}
                      handleDistrictChange={this.handleDistrictChange}
                    />
                  </div>
                </div> */}
              </div>

              <div className="col-sm">
                <div
                  className="row"
                  style={{
                    marginBottom: "0px",
                  }}
                >
                  <div
                    className="col fadeInUp"
                    style={{
                      textAlign: "left",
                      animationDelay: "1.2s",
                      marginBottom: "-8px",
                    }}
                  >
                    <h6
                      className="home-title"
                      style={{
                        color: "#ff446a",
                        wordBreak: "keep-all",
                        wordWrap: "normal",
                        fontSize: "1.2rem",
                      }}
                    >
                      SPREAD TRENDS
                    </h6>
                  </div>

                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.3s", alignItems: "right" }}
                  >
                    <div
                      className="home-toggle float-right"
                      style={{
                        marginTop: "5px",
                      }}
                    >
                      <Switch
                        className="react-switch"
                        onChange={this.onSwitch}
                        checked={toggleSwitch}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={11}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0 0 5px rgba(0,0,0,0.2)"
                        activeBoxShadow="0 0 2px rgba(0,0,0,0.25)"
                        height={16}
                        width={35}
                      ></Switch>
                    </div>
                  </div>
                  <div className="w-100"></div>
                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.4s" }}
                  >
                    <h6 style={{ color: "rgb(226, 42, 79)" }}>
                      {
                        stateFullName[
                          this.props.match.params.stateid.toUpperCase()
                        ]
                      }
                    </h6>
                  </div>
                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.4s" }}
                  >
                    <h6 style={{ textAlign: "right" }}>
                      <span
                        className="text-secondary"
                        style={{
                          fontSize: 10,
                          background: "#ece7e7",
                          borderRadius: "3px",
                        }}
                      >
                        {!toggleSwitch ? `CUMULATIVE` : `EVERYDAY`}
                      </span>
                    </h6>
                  </div>
                </div>

                <div className="w-100"></div>
                <div className="row">
                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.5s" }}
                  >
                    <h6
                      className="timelineButton"
                      onClick={() =>
                        this.setState({
                          beginning: true,
                          twoWeeks: false,
                          oneMonth: false,
                        })
                      }
                    >
                      &nbsp;Beginning{" "}
                      {beginning && (
                        <Icon.CheckCircle size={10} strokeWidth={3} />
                      )}
                    </h6>
                  </div>

                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.6s" }}
                  >
                    <h6
                      className="timelineButton"
                      onClick={() =>
                        this.setState({
                          beginning: false,
                          twoWeeks: false,
                          oneMonth: true,
                        })
                      }
                    >
                      &nbsp;1 Month{" "}
                      {oneMonth && (
                        <Icon.CheckCircle size={10} strokeWidth={3} />
                      )}
                    </h6>
                  </div>

                  <div
                    className="col fadeInUp"
                    style={{ animationDelay: "1.7s" }}
                  >
                    <h6
                      className="timelineButton"
                      onClick={() =>
                        this.setState({
                          beginning: false,
                          twoWeeks: true,
                          oneMonth: false,
                        })
                      }
                    >
                      &nbsp;15 Days{" "}
                      {twoWeeks && (
                        <Icon.CheckCircle size={10} strokeWidth={3} />
                      )}
                    </h6>
                  </div>
                </div>

                <div className="w-100"></div>
                <div
                  className="row fadeInUp"
                  style={{ animationDelay: "1.8s", marginTop: "-25px" }}
                >
                  {!toggleSwitch && (
                    <React.Fragment>
                      <StateLinePlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        bgColor="#e4f3fa"
                        titleClass="text-info"
                        type="confirmed"
                        date={date}
                        total={lineTotalConfirmedData.slice(
                          timelineLength,
                          lineTotalConfirmedData.length
                        )}
                        daily={dailyConfirmed[0]}
                        stroke="#0992c0"
                        lineStroke="#35aad1"
                        color1="#6ebed6"
                        color2="#55b2ce"
                        divideBy={
                          Math.max.apply(
                            Math,
                            lineTotalConfirmedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 100
                            ? 100
                            : 10
                        }
                      />
                      <div className="w-100"></div>
                      <StateLinePlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        bgColor="#f5d2d2"
                        titleClass="text-danger"
                        type="active"
                        date={date}
                        total={lineTotalActiveData.slice(
                          timelineLength,
                          lineTotalActiveData.length
                        )}
                        daily={
                          dailyConfirmed[0] -
                          dailyRecovered[0] -
                          dailyDeceased[0]
                        }
                        stroke="#ff446a"
                        lineStroke="#ec7d93"
                        color1="#f16783"
                        color2="#ff446a"
                        divideBy={
                          Math.max.apply(
                            Math,
                            lineTotalConfirmedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 100
                            ? 100
                            : 10
                        }
                      />
                      <div className="w-100"></div>
                      <StateLinePlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        bgColor="#d5e9d5"
                        titleClass="text-success"
                        type="recovered"
                        date={date}
                        total={lineTotalRecoveredData.slice(
                          timelineLength,
                          lineTotalRecoveredData.length
                        )}
                        daily={dailyRecovered[0]}
                        stroke="#469246"
                        lineStroke="#78b978"
                        color1="#5cb85c"
                        color2="#5cb85c"
                        divideBy={
                          Math.max.apply(
                            Math,
                            lineTotalRecoveredData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 100
                            ? 100
                            : 10
                        }
                      />
                      <div className="w-100"></div>
                      <StateLinePlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        bgColor="#f3f3f3"
                        titleClass="text-secondary"
                        type="deceased"
                        date={date}
                        total={lineTotalDeceasedData.slice(
                          timelineLength,
                          lineTotalDeceasedData.length
                        )}
                        daily={dailyDeceased[0]}
                        stroke="#2e2d2d"
                        lineStroke="#666565"
                        color1="#808080"
                        color2="#5e5a5a"
                        divideBy={
                          Math.max.apply(
                            Math,
                            lineTotalDeceasedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 10
                            ? 100
                            : 10
                        }
                      />
                      <div className="w-100"></div>
                      <div className="w-100"></div>

                      <div className="col">
                        <section
                          className="graphsection"
                          style={{
                            backgroundColor: "#e6e8f1",
                            borderRadius: "6px",
                            paddingTop: "5px",
                            marginTop: "10px",
                          }}
                        >
                          <h5
                            style={{
                              paddingTop: "5px",
                              marginBottom: "-80px",
                              textAlign: "left",
                              marginLeft: 10,
                              fontSize: "0.8rem",
                              color: "#3e4da3",
                            }}
                          >
                            TESTED
                            <h6 style={{ fontSize: "10px", color: "#3f51b5" }}>
                              {
                                dateFormattedTestData[
                                  dateFormattedTestData.length - 1
                                ].date
                              }

                              <h5 style={{ fontSize: 14, color: "#3e4da3" }}>
                                {commaSeperated(
                                  dateFormattedTestData[
                                    dateFormattedTestData.length - 1
                                  ].totaltested
                                )}{" "}
                                <span style={{ fontSize: 9 }}>
                                  {dateFormattedTestData[
                                    dateFormattedTestData.length - 1
                                  ].totaltested !== "-"
                                    ? dateFormattedTestData[
                                        dateFormattedTestData.length - 1
                                      ].totaltested &&
                                      dateFormattedTestData[
                                        dateFormattedTestData.length - 2
                                      ].totaltested
                                      ? "+" +
                                        commaSeperated(
                                          dateFormattedTestData[
                                            dateFormattedTestData.length - 1
                                          ].totaltested -
                                            dateFormattedTestData[
                                              dateFormattedTestData.length - 2
                                            ].totaltested
                                        )
                                      : ""
                                    : "-"}
                                </span>
                              </h5>
                            </h6>
                          </h5>
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                            aspect={2.4}
                          >
                            <LineChart
                              data={dateFormattedTestData.slice(
                                timelineLength,
                                dateFormattedTestData.length
                              )}
                              margin={{
                                top: 40,
                                right: -30,
                                left: 10,
                                bottom: -12,
                              }}
                              syncId="linechart"
                            >
                              <XAxis
                                dataKey="date"
                                tick={{ stroke: "#6471b3", strokeWidth: 0.2 }}
                                style={{ fontSize: 8 }}
                                tickSize={5}
                                tickCount={8}
                              />
                              <YAxis
                                domain={[
                                  0,
                                  Math.ceil(
                                    Math.max(...cumulativeTestDataArray) / 1000
                                  ) * 1000,
                                ]}
                                orientation="right"
                                tick={{ stroke: "#6471b3", strokeWidth: 0.2 }}
                                tickFormatter={format("~s")}
                                tickSize={5}
                                style={{ fontSize: 8 }}
                                tickCount={8}
                              />
                              <Retooltip
                                contentStyle={{
                                  background: "rgba(255,255,255,0)",
                                  border: "none",
                                  borderRadius: "5px",
                                  fontSize: "8px",
                                  fontFamily: "notosans",
                                  textTransform: "uppercase",
                                  textAlign: "left",
                                  lineHeight: 0.8,
                                }}
                                cursor={false}
                                position={{ x: 120, y: 22 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="totaltested"
                                stroke="#6471b3"
                                strokeWidth="3"
                                strokeLinecap="round"
                                name="Tested"
                                isAnimationActive={true}
                                connectNulls={true}
                                dot={{
                                  stroke: "#3e4da3",
                                  strokeWidth: 0.1,
                                  fill: "#3e4da3",
                                }}
                                onClick={() => {
                                  ReactGa.event({
                                    category: "State test Data Tested",
                                    action: "test line hover",
                                  });
                                }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </section>
                      </div>
                    </React.Fragment>
                  )}
                  {toggleSwitch && (
                    <React.Fragment>
                      <StateBarPlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        type="confirmed"
                        bgColor="#e4f3fa"
                        titleClass="text-info"
                        data={barDailyConfirmedData.slice(
                          timelineLength,
                          barDailyConfirmedData.length
                        )}
                        date={date}
                        daily={dailyConfirmed[0]}
                        dailyDelta={dailyDeltaConfirmed[0]}
                        sparkline={sparklineTotalConfirmedData}
                        divideBy={
                          Math.max.apply(
                            Math,
                            barDailyConfirmedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 100
                            ? 100
                            : 10
                        }
                        stroke="#0992c0"
                        color1="#6ebed6"
                        color2="#55b2ce"
                      />
                      <div className="w-100"></div>
                      <StateBarPlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        type="active"
                        bgColor="#f5d2d2"
                        titleClass="text-danger"
                        data={barDailyActiveData.slice(
                          timelineLength,
                          barDailyActiveData.length
                        )}
                        date={date}
                        daily={
                          dailyConfirmed[0] -
                          dailyRecovered[0] -
                          dailyDeceased[0]
                        }
                        dailyDelta={
                          dailyDeltaConfirmed[0] -
                          dailyDeltaRecovered[0] -
                          dailyDeltaDeceased[0]
                        }
                        sparkline={sparklineDailyActiveData}
                        divideBy={
                          Math.max.apply(
                            Math,
                            barDailyConfirmedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 100
                            ? 100
                            : 10
                        }
                        stroke="#f16783"
                        color1="#f16783"
                        color2="#ff446a"
                      />
                      <div className="w-100"></div>
                      <StateBarPlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        type="recovered"
                        bgColor="#d5e9d5"
                        titleClass="text-success"
                        data={barDailyRecoveredData.slice(
                          timelineLength,
                          barDailyRecoveredData.length
                        )}
                        date={date}
                        daily={dailyRecovered[0]}
                        dailyDelta={dailyDeltaRecovered[0]}
                        sparkline={sparklineDailyRecoveredData}
                        divideBy={
                          Math.max.apply(
                            Math,
                            barDailyRecoveredData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 50
                            ? 50
                            : 10
                        }
                        stroke="#58bd58"
                        color1="#7ed87e"
                        color2="#5cb85c"
                      />
                      <div className="w-100"></div>
                      <StateBarPlot
                        stateName={
                          stateFullName[
                            this.props.match.params.stateid.toUpperCase()
                          ]
                        }
                        type="deceased"
                        bgColor="#f3f3f3"
                        titleClass="text-secondary"
                        data={barDailyDeceasedData.slice(
                          timelineLength,
                          barDailyDeceasedData.length
                        )}
                        date={date}
                        daily={dailyDeceased[0]}
                        dailyDelta={dailyDeltaDeceased[0]}
                        sparkline={sparklineDailyDeceasedData}
                        divideBy={
                          Math.max.apply(
                            Math,
                            barDailyDeceasedData.map(function (item) {
                              return Number(item.stateid);
                            })
                          ) >= 50
                            ? 50
                            : 5
                        }
                        stroke="#474646"
                        color1="#808080"
                        color2="#5e5a5a"
                      />
                      <div className="w-100"></div>

                      <div className="col">
                        <section
                          className="graphsection"
                          style={{
                            alignSelf: "center",
                            backgroundColor: "#e6e8f1",
                            borderRadius: "6px",
                            marginTop: 10,
                          }}
                        >
                          <h5
                            style={{
                              paddingTop: "10px",
                              marginBottom: "-80px",
                              textAlign: "left",
                              marginLeft: 10,
                              color: "#3e4da3",
                              fontSize: "0.8rem",
                            }}
                          >
                            TESTED
                            <h6
                              style={{
                                fontSize: "10px",
                                color: "#3f51b5",
                                textTransform: "capitalize",
                              }}
                            >
                              {
                                dailyFormattedTestData[
                                  dailyFormattedTestData.length - 1
                                ].date
                              }

                              <h5 style={{ fontSize: 14, color: "#3e4da3" }}>
                                {commaSeperated(
                                  dailyFormattedTestData[
                                    dailyFormattedTestData.length - 1
                                  ].dailytested
                                )}{" "}
                                <span style={{ fontSize: 9 }}>
                                  {dailyFormattedTestData[
                                    dailyFormattedTestData.length - 1
                                  ].dailytested &&
                                  dailyFormattedTestData[
                                    dailyFormattedTestData.length - 2
                                  ].dailytested
                                    ? dailyFormattedTestData[
                                        dailyFormattedTestData.length - 1
                                      ].dailytested -
                                        dailyFormattedTestData[
                                          dailyFormattedTestData.length - 2
                                        ].dailytested >
                                      0
                                      ? `+${commaSeperated(
                                          Math.abs(
                                            dailyFormattedTestData[
                                              dailyFormattedTestData.length - 1
                                            ].dailytested -
                                              dailyFormattedTestData[
                                                dailyFormattedTestData.length -
                                                  2
                                              ].dailytested
                                          )
                                        )}`
                                      : `-${commaSeperated(
                                          Math.abs(
                                            dailyFormattedTestData[
                                              dailyFormattedTestData.length - 1
                                            ].dailytested -
                                              dailyFormattedTestData[
                                                dailyFormattedTestData.length -
                                                  2
                                              ].dailytested
                                          )
                                        )}`
                                    : ""}
                                </span>
                              </h5>
                            </h6>
                          </h5>
                          <ResponsiveContainer
                            width="100%"
                            height="100%"
                            aspect={2.4}
                          >
                            <BarChart
                              data={dailyFormattedTestData.slice(
                                timelineLength,
                                dailyFormattedTestData.length
                              )}
                              margin={{
                                top: 40,
                                right: -30,
                                left: 10,
                                bottom: -12,
                              }}
                              syncId="barchart"
                            >
                              <XAxis
                                dataKey="date"
                                tick={{ stroke: "#6471b3", strokeWidth: 0.2 }}
                                axisLine={{ color: "#6471b3" }}
                                style={{ fontSize: 8 }}
                                tickSize={5}
                                tickCount={6}
                              />
                              <YAxis
                                domain={[
                                  Math.floor(
                                    Math.min.apply(
                                      Math,
                                      dailyFormattedTestData.map(function (
                                        item
                                      ) {
                                        return Number(item.dailytested);
                                      })
                                    ) / 1000
                                  ) * 1000,
                                  Math.ceil(
                                    Math.max.apply(
                                      Math,
                                      dailyFormattedTestData.map(function (
                                        item
                                      ) {
                                        return Number(item.dailytested);
                                      })
                                    ) / 1000
                                  ) * 1000,
                                ]}
                                orientation="right"
                                tick={{ stroke: "#6471b3", strokeWidth: 0.2 }}
                                tickFormatter={format("~s")}
                                tickSize={5}
                                style={{ fontSize: 8 }}
                                tickCount={8}
                              />
                              <Retooltip
                                contentStyle={{
                                  background: "rgba(255,255,255,0)",
                                  border: "none",
                                  borderRadius: "5px",
                                  fontSize: "8px",
                                  fontFamily: "notosans",
                                  textTransform: "uppercase",
                                  textAlign: "left",
                                  lineHeight: 0.8,
                                }}
                                cursor={{ fill: "transparent" }}
                                position={{ x: 120, y: 22 }}
                              />
                              <Bar
                                dataKey="dailytested"
                                name="Tested"
                                fill="#3e4da3"
                                radius={[2, 2, 0, 0]}
                                onClick={() => {
                                  ReactGa.event({
                                    category: "Graph TestedBar State",
                                    action: "State Testedbar hover",
                                  });
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </section>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </React.Fragment>
      );
    } else {
      if (stateID.includes(this.props.match.params.stateid.toUpperCase())) {
        return (
          <div className="containerHome">
            <div
              className="spinner-grow"
              role="status"
              style={{ alignContent: "center" }}
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        );
      } else return <NotFound />;
    }
  }
}

export default StateDetails;
