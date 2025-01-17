import React, { Component, button } from 'react';
import { ListView, Modal } from 'antd-mobile';
// import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import { connect } from 'react-redux';
import { bindActionCreators } from "redux";

//action
import {
  setTokenAction, setUsernameAction, setBottomstatusAction,
  setShowmodalAction, setShowmodaltwoAction, setAccountokmodalAction, setShowalertAction
} from '../../store/action/App';


import './home.css';
import TopBar from '../../component/TopBar';

import CreateWalletOne from '../../component/CreateWalletOne';
import CreateWalletTwo from '../../component/CreateWalletTwo';
import CreateWalletOK from '../../component/CreateWalletOK';
import NAlert from '../../component/Alert';


//polkadot
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

//合约abi
import tem_abi from './temmetadata.json'
import main_abi from './mainmetadata.json'
import { stringToU8a, u8aToHex } from '@polkadot/util';
import { Keyring } from '@polkadot/keyring'
import { mnemonicGenerate, blake2AsHex } from '@polkadot/util-crypto';
//NFT合约链自定义类型Types
import types from '../../component/NFTChainTypes/types'



const keyring = new Keyring({ type: 'sr25519', ss58Format: 2 });

//Chain API
// //调用NFTMart区块链测试网
const provider = new WsProvider('wss://test-chain.bcdata.top');
let api;

const data = [
  {
    img: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
    title: 'Title',
    des: '描述',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/XmwCzSeJiqpkuMB.png',
    title: 'Title',
    des: '描述',
  },
  {
    img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
    title: 'Title',
    des: '描述',
  },
];
const NUM_ROWS = 20;
let pageIndex = 0;

function genData(pIndex = 0) {
  const dataBlob = {};
  for (let i = 0; i < NUM_ROWS; i++) {
    const ii = (pIndex * NUM_ROWS) + i;
    dataBlob[`${ii}`] = `row - ${ii}`;
  }
  return dataBlob;
}

class Home extends Component {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      words: [
        "minor",
        "nasty",
        "wasp",
        "major",
        "pumpkin",
        "lounge",
        "door",
        "blade",
        "trip",
        "value",
        "render",
        "cook"
      ],
      dataSource,
      isLoading: true,
      dataList: [{
        flag: "A",
        createMonth: "12",
        desc: "Description",
        enentName: "Event Name",
        location: "Location details",
        startTime: "Start time"
      }, {
        flag: "A",
        createMonth: "12",
        desc: "Description",
        enentName: "Event Name",
        location: "Location details",
        startTime: "Start time"
      }, {
        flag: "A",
        createMonth: "12",
        desc: "Description",
        enentName: "Event Name",
        location: "Location details",
        startTime: "Start time"
      }],
      showToast: false,
      genesisHash: ''//polkadot
    };

  };

  async componentDidMount() {
    //actions  显示底部状态栏
    this.props.actions.setBottomstatus(false);
    //Chain
    api = await ApiPromise.create({ provider, types });
    const [chain, nodeName, nodeVersion] = await Promise.all([
      api.rpc.system.chain(),
      api.rpc.system.name(),
      api.rpc.system.version()
    ]);
    await this.getTem_Contract(api)
    console.log(`You are connected to chain ${chain} using ${nodeName} v${nodeVersion}`);
  }

  async getTem_Contract(api) {
    //合约
    this.setState({ genesisHash: api.genesisHash.toHex() });
    const alice_address = "65ADzWZUAKXQGZVhQ7ebqRdqEzMEftKytB8a7rknW82EASXB";
    //模板合约abi
    //const tem_abi = tem_abi;
    //模板合约address
    const tem_address = "61oncFjVSx8UP9MjT6qKzw1DmpQDcR79MGojqdcAUpWEra2Y";
    const tem_contract = new ContractPromise(api, tem_abi, tem_address);
    //createMeeting (name: Vec<u8>, desc: Vec<u8>, poster: Vec<u8>, uri: Vec<u8>, startTime: u64, endTime: u64, startSaleTime: u64, endSaleTime: u64, meetCodeHash: Hash, mainStubAble: MainStub)
    if (localStorage.hasOwnProperty('nft-pair')) {
      //取出来
      const pair = localStorage.getItem("nft-pair")
      {
        //新生成助记词
        const mnemonic = mnemonicGenerate(12);

        if (mnemonic != null && mnemonic.length > 0) {
          const testpair = keyring.createFromUri(mnemonic, { name: 'test-arrom' });
          console.log("testpair-->" + JSON.stringify(testpair.address))
        }
      }

      const alicePair = keyring.addFromUri('//Alice');
      console.log("Alice pair-->" + JSON.stringify(alicePair.address))
      let value = 0;
      const gasLimit = -1;//不限制gas

      //OK Template合约--(getController)/不需要携带参数用（query）
      // const { gasConsumed, result, output }  = await tem_contract.query
      //     .getController(alicePair.address,{value,gasLimit})
      // console.log(result.toHuman());
      // console.log(output.toHuman());

      //OK Template合约--(setController)/toaddress--要设置的新的地址,携带参数（tx）
      // const toaddress = 'DdYfnXdfpwCmNmNsLZmHGXGKi3GDbET1yUZx9qFcGiwVSNu';
      // await tem_contract.tx
      // .setController({ value, gasLimit }, toaddress)
      // .signAndSend(alicePair, (result) => {
      //   if (result.status.isInBlock) {
      //     console.log('正在提交到链上');
      //   } else if (result.status.isFinalized) {
      //     console.log('交易确认');
      //     console.log(result.toHuman())
      //   }
      // });

      //OK Template合约--(createMeeting)/
      // (name: Vec<u8>, 
      // desc: Vec<u8>, 
      // poster: Vec<u8>, 
      // uri: Vec<u8>, 
      // startTime: u64, 
      // endTime: u64, 
      // startSaleTime: u64, 
      // endSaleTime: u64, 
      // meetCodeHash: Hash, 
      // mainStubAble: MainStub),携带参数（tx）
      const name = '1';
      const desc = '1';
      const poster = '1';
      const uri = '1';
      const startTime = 1;
      const endTime = 1;
      const startSaleTime = 1;
      const endSaleTime = 1;
      const templateIndexName="1";
      value=10000000000n;
      await tem_contract.tx.createMeeting(
        { value, gasLimit }, name, desc, poster, uri, startTime,
         endTime, startSaleTime, endSaleTime, templateIndexName
      )
      .signAndSend(alicePair, (result) => {
        if (result.status.isInBlock) {
          console.log('正在提交到链上');
        } else if (result.status.isFinalized) {
          console.log('交易确认');
          console.log(result.toHuman())
        }
      });


    // }
      // const name = '第一个活动';
      // const desc = '第一个活动的描述';
      // const poster = '第一个创建人';
      // const uri = 'www.baidu.com';
      // const startTime = 1625910132;
      // const endTime = 1628588532;
      // const startSaleTime = 1625910132;
      // const endSaleTime = 1628588532;
      // //线下会议hash(必须32字节)0xa14ad4f877a7f110ef03bb1ed0c5dc4324ede59ec204000bceb65c1efe7c2903
      // const meetCodeHash = '0xa14ad4f877a7f110ef03bb1ed0c5dc4324ede59ec204000bceb65c1efe7c2903';
      // //主合约地址:6555P4ummgGtrsjrR2UL6oHWUaWQ7jC7pV2HZEXbnF3F89WQ
      // const mainAddress = '6555P4ummgGtrsjrR2UL6oHWUaWQ7jC7pV2HZEXbnF3F89WQ';
      // const mainStubAble = u8aToHex(keyring.decodeAddress(mainAddress));
      // console.log("decodeAddress--"+mainStubAble+"///"+JSON.stringify(api.query.assets));
      // value = 100n;
      // gasLimit=3000n * 1000000n;
      // await tem_contract.tx.createMeeting(
      //  { value, gasLimit },name,desc,poster,uri,startTime,endTime,startSaleTime,endSaleTime,meetCodeHash,mainStubAble
      // )
      // .signAndSend(alicePair, (result) => {
      //   if (result.status.isInBlock) {
      //     console.log('正在提交到链上');
      //   } else if (result.status.isFinalized) {
      //     console.log('交易确认');
      //     console.log(result.toHuman())
      //   }
      // });


      //主合约调用
      {
        //OK Main合约--(addMeeting)(
        //   meetingAddr: AccountId, 
        // creator: AccountId, 
        // name: Vec<u8>, 
        // desc: Vec<u8>, 
        // poster: Vec<u8>, 
        // uri: Vec<u8>, 
        // startTime: u64, 
        // endTime: u64, 
        // startSaleTime: u64, 
        // endSaleTime: u64)
        // /携带参数（tx）
        // const meetingAddr = alicePair.address;
        // const creator = alicePair.address;
        // const name = '第一个活动';
        // const desc = '第一个活动的描述';
        // const poster = '第一个创建人';
        // const uri = 'www.baidu.com';
        // const startTime = 1625910132;
        // const endTime = 1628588532;
        // const startSaleTime = 1625910132;
        // const endSaleTime = 1628588532;
        // //主合约abi
        // //const main_abi = main_abi;
        // //主合约地址:6555P4ummgGtrsjrR2UL6oHWUaWQ7jC7pV2HZEXbnF3F89WQ
        // const main_address = '6555P4ummgGtrsjrR2UL6oHWUaWQ7jC7pV2HZEXbnF3F89WQ';
        // const main_contract = new ContractPromise(api,main_abi,main_address);
        // await main_contract.tx
        // .addMeeting({ value, gasLimit }, meetingAddr,
        //   creator,
        //   name,
        //   desc,
        //   poster,
        //   uri,
        //   startTime,
        //   endTime,
        //   startSaleTime,
        //   endSaleTime )
        // .signAndSend(alicePair, (result) => {
        //   if (result.status.isInBlock) {
        //     console.log('主合约addMeeting--正在提交到链上');
        //   } else if (result.status.isFinalized) {
        //     console.log('主合约addMeeting--交易确认');
        //     console.log(result.toHuman())
        //   }
        // });
      }
    }  

  }
  /**
   * 获取所有的会议
   */
  async getAllMeeting(api) {
    console.log("getAllMeeting---start")
    const value = 0;
    const gasLimit = -1;//不限制gas
    const alicePair = keyring.addFromUri('//Alice');
    console.log("Alice pair-->" + JSON.stringify(alicePair.address))

    const main_address = "629eniaUzqNLN1okBrmEbEpFY7TqzWcgi9ggquZRtVX6o1b3"

    const main_contract = new ContractPromise(api, main_abi, main_address);

    const { result, output } = await main_contract.query.getAllMeeting(alicePair.address, { value, gasLimit });
    if (result.isOk) {
      // should output 123 as per our initial set (output here is an i32)
      console.log('Success', output.toHuman());
    } else {
      console.error('Error', result.asErr);
    }
  }



  componentWillMount() {
    console.log("WillMount");
    setTimeout(() => {
      this.rData = genData();
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 600);
  }

  componentWillUnmount() {
    this.props.actions.setShowModal(false);
    this.props.actions.setShowModalTwo(false);
    this.props.actions.setAccountOKModal(false);
  }

  onEndReached = (event) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    console.log('reach end', document.documentElement.clientHeight);
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.rData = { ...this.rData, ...genData(++pageIndex) };
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.rData),
        isLoading: false,
      });
    }, 1000);
  }

  render = () => {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          height: 0
        }}
      />
    );
    let index = data.length - 1;
    const row = (rowData, sectionID, rowID) => {
      if (index < 0) {
        index = data.length - 1;
      }
      const obj = data[index--];
      const imageHeight = window.innerWidth - 30 - 30;
      return (
        <div key={rowID} className='card-content'
          style={{
            backgroundImage: "url('./images/cardimg.png')",
            backgroundRepeat: 'no-repeat',
            height: '' + imageHeight + 'px',
          }} onClick={() => this.props.history.push('/Home/activityDetail')}>
          <div className="top-container">
            <div className='top-name' style={{
              borderRadius: '50px', width: '50px', height: '50px',
              backgroundColor: "#ffffff",
              display: 'flex'
            }}>
              <span className="top-text">A</span>
            </div>
            <div className='top-time-group'>
              <div className='top-time-1'>12</div>
              <div className='top-time-2'>Nav</div>
            </div>
          </div>
          <div className='bottom-container'>
            <div>
              <div style={{ marginBottom: '8px', textShadow: '#fff 1px 0 0,#fff 0 1px 0,#fff -1px 0 0,#fff 0 -1px 0' }}>Description</div>
              <div style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold', textShadow: '#fff 1.2px 0 0,#fff 0 1.2px 0,#fff -1.2px 0 0,#fff 0 -1.2px 0' }}>Event Name</div>
              <div style={{ display: 'flex' }}><div><img style={{ margin: '0px 5px 5px 0px', width: '15px', height: '15px' }} src='./images/location.png'></img></div><span style={{ textShadow: '#fff 1px 0 0,#fff 0 1px 0,#fff -1px 0 0,#fff 0 -1px 0' }}>Location details</span></div>
              <div style={{ display: 'flex' }}><div><img style={{ margin: '0px 5px 5px 0px', width: '15px', height: '15px' }} src='./images/time.png'></img></div><span style={{ textShadow: '#fff 1px 0 0,#fff 0 1px 0,#fff -1px 0 0,#fff 0 -1px 0' }}>Start time</span></div>
            </div>
          </div>
        </div>
      );
    };

    //搜索框高度
    const searchbarHeight = 25;
    //空白区域高度
    const whitespaceHeight = 9;
    //账户信息高度
    const accountInfoHeight = 42;
    //底部Tab高度
    const tabbarHeight = 46;

    const height = parseInt(window.innerHeight) - searchbarHeight - whitespaceHeight - accountInfoHeight - 2 * tabbarHeight + 26;
    return (
      <div className="content" style={{ position: "absolute" }}>
        <TopBar></TopBar>
        <div>
          <ListView
            ref={el => this.lv = el}
            dataSource={this.state.dataSource}
            renderHeader={() => { console.log("card-height=" + window.innerHeight + "///" + document.documentElement.clientHeight) }}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={row}
            renderSeparator={separator}
            className=""
            pageSize={4}
            useBodyScroll
            onScroll={() => { console.log('scroll'); }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            style={{ height: '' + height + 'px', overflow: 'auto' }}
          />
        </div>

        <div className={this.props.app.showmodal ? 'showmodal' : 'hidemodal'}
          style={{ height: "" + window.innerHeight + "px" }}>
          {/* 生成钱包助记词---弹窗 */}
          <CreateWalletOne words={this.state.words}></CreateWalletOne>
        </div>

        <div className={this.props.app.showmodaltwo ? 'showmodaltwo' : 'hidemodaltwo'}
          style={{ height: "" + window.innerHeight + "px" }}>
          {/* 输入钱包助记词---弹窗 */}
          <CreateWalletTwo ></CreateWalletTwo>
        </div>

        <div className={this.props.app.showaccountok ? 'showaccountokmodal' : 'hideaccountokmodal'}
          style={{ height: "" + window.innerHeight + "px" }}>
          {/* 输入钱包助记词---弹窗 */}
          <CreateWalletOK ></CreateWalletOK>
        </div>

        <div className={this.props.app.showalert ? 'showalertmodal' : 'hidealertmodal'}
          style={{ height: "" + window.innerHeight + "px" }}>
          <NAlert msg="助记词顺序有问题"></NAlert>
        </div>
      </div>
    );
  }
}

//获取最新的store里的状态，通过this.props获取
const mapStateToProps = (state) => {
  return {
    app: state.app
  }
}
//更新状态提交到store
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      setToken: setTokenAction,
      setUsername: setUsernameAction,
      setBottomstatus: setBottomstatusAction,
      setShowModal: setShowmodalAction,
      setShowModalTwo: setShowmodaltwoAction,
      setAccountOKModal: setAccountokmodalAction
    }, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
