#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

/**
活动模板合约
1. 创建活动，部署活动合约，并将创建的活动条件到主合
2. 不同活动模板，因为相应的活动不同，创建的方法也会不同；
*/
#[ink::contract]
mod off_template {
    use ink_env::call::FromAccountId;
    use stub::MainStub;
    use ink_prelude::vec::Vec;
    use ink_prelude::format;
    use ink_storage::{
        collections::{HashMap as StorageHashMap, },
    };
    #[ink(storage)]
    pub struct OfflineTemplate {
        controller: AccountId,   // 主合约地址
        owner: AccountId,   // 所有者
        fee_ratio: u64,     // 按票价提取多少比例作为服务费，不过服务费不能低于 min_ticket_fee
        meeting_seq:u32,
        meeting_code_map:StorageHashMap<Vec<u8>,Hash>,
    }

    impl OfflineTemplate {
        #[ink(constructor)]
        pub fn new(controller: AccountId) -> Self {
            let caller = Self::env().caller();
            Self {
                controller: controller,
                owner: caller,
                fee_ratio:Default::default(),
                meeting_seq:Default::default(),
                meeting_code_map:Default::default(),
            }
        }

        // 返回主控合约地址
        #[ink(message)]
        pub fn get_controller(&self)->AccountId {
            self.controller
        }

        // 设置主合约地址
        #[ink(message)]
        pub fn set_controller(&mut self,new_onwer:AccountId)->bool {
            self.ensure_owner();
            self.controller = new_onwer;
            true
        }

        /// Panic if `owner` is not an owner,
        fn ensure_owner(&self) {
            assert_eq!(self.owner, self.env().caller(), "not owner");
        }

        /// 返回控制人账号
        #[ink(message)]
        pub fn get_owner(&self) -> AccountId {
			self.owner
        }

        // 增加会议的hash_code
        #[ink(message)]
        pub fn add_meeting_code_hash(&mut self,name:Vec<u8>, meeting_code_hash:Hash)->bool{
            self.meeting_code_map.insert(name, meeting_code_hash);
            true
        }

        #[ink(message)]
        pub fn get_meeting_code_hash(&self)->Vec<(Vec<u8>,Hash)>{
            self.meeting_code_map.iter().map(|(k, v)|(k.clone(),v.clone())).collect()
        }

        // 创建会议活动
        // 1. 部署一个活动合约，传入主合约地址等参数，获得合约地址
        // 2. 调用主合约的 add_meeting 接口，添加活动；
        // 3. 返回活动合约地址
        #[ink(message,payable)]
        pub fn create_meeting(&mut self, 
            name: Vec<u8>, desc: Vec<u8>, poster: Vec<u8>, uri: Vec<u8>, 
            start_time: u64, end_time: u64, start_sale_time: u64, end_sale_time: u64,template_index_name:Vec<u8>,
            publisher:Vec<u8>,//会议发起者
            min_price:u128,     //最低价
        ) -> AccountId{
                let caller = Self::env().caller();
                let income = Self::env().transferred_balance();
                // let total_balance:Balance = Self::env().balance();
                ink_env::debug_message(&format!("-------------------------self.meeting_seq {:?}", self.meeting_seq));
                self.meeting_seq=self.meeting_seq.checked_add(1).unwrap();
                ink_env::debug_message(&format!("-------------------------after add one self.meeting_seq {:?}", self.meeting_seq));
                let salt = self.meeting_seq.to_le_bytes();
                let meeting_id = self.meeting_seq;
                let template_addr = self.get_self();
                let mut main_contract: MainStub = FromAccountId::from_account_id(self.controller);
                let meet_code_hash:Hash = self.meeting_code_map.get(&template_index_name).unwrap().clone();
                let new_meeting = offline_meeting::Meeting::new(meeting_id,name.clone(), desc.clone(), poster.clone(), uri.clone(), 
                start_time, end_time, start_sale_time, end_sale_time, template_addr,main_contract.clone(),caller)
                                .endowment(income)
                                .code_hash(meet_code_hash)
                                .salt_bytes(salt)
                                .instantiate()
                                .expect("fail");
                let meeting_addr = new_meeting.get_self();
                // 调用主合约 add_meeting
                // 调用主合约,注册活动.
                
            let class_id = main_contract.add_meeting(meeting_addr,caller, name, desc, poster, uri, 
                start_time, end_time, start_sale_time, end_sale_time,
                publisher,min_price,
            ).unwrap();
            meeting_addr
        }

        pub fn get_self(&self)-> AccountId{
            Self::env().account_id()
        }



        // /**
        // 设置服务费比例
        // 1. 必须是 owner 才可以修改
        // */
        // pub fn set_fee_ratio(&mut self, fee_ratio: u64){

        // }

        // /**
        // 返回服务费比例
        // */
        // pub fn get_fee_rate(&self)->u64{

        // }
    }
}
