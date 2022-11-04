use std::sync::Mutex;

use cfg_if::cfg_if;
use lazy_static::lazy_static;
use sysinfo::ProcessStatus;
cfg_if! {
    if #[cfg(target_os = "linux")] {
        use libc::pid_t;
    }
}

cfg_if! {
    if #[cfg(target_os = "linux")] {
        pub struct ProcessIdAndSatus {
            pub id: Option<usize>,
            pub process_status: ProcessStatus,
        }
    }else{
        pub struct ProcessIdAndSatus {
            pub id: Option<usize>,
            pub process_status: ProcessStatus,
        }
    }
}

pub struct GlobalSingelton {
    pub child_process: ProcessIdAndSatus,
}

lazy_static! {
    pub static ref GLOBAL_SINGELTON: Mutex<GlobalSingelton> = Mutex::new(GlobalSingelton {
        child_process: ProcessIdAndSatus {
            id: None,
            process_status: ProcessStatus::Dead
        }
    });
}
