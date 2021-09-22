#![cfg_attr(not(feature = "std"), no_std)]
use ink_lang as ink;

#[ink::contract]
mod template {
    use ink_storage::{
        collections::HashMap as StorageMap,
    };

    #[ink(storage)]
    pub struct UserInfo {
        uerAccount: StorageMap<AccountId,Hash>, //用户id,IPFS hash值. 
    }

    impl UserInfo {
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                uerAccount: Default::default(),
            }
        }

        #[ink(message)]
        pub fn insert_user(&mut self,account:AccountId,user_hash:Hash) -> boole {
            self.uerAccount.insert(account,user_hash);
            return true;
        }

        #[ink(message)]
        pub fn user_info(&self,account:AccountId)->Hash{
            return self.uerAccount.get(&account);
        }
    }
}
