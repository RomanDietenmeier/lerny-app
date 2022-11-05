use std::{io::ErrorKind, process::Child, sync::Mutex};

use cfg_if::cfg_if;
use lazy_static::lazy_static;


cfg_if! {
    if #[cfg(target_os = "linux")] {
        pub struct ProcessIdAndStatus {
            pub child_process: Option<Child>
        }
    }else{
        pub struct ProcessIdAndStatus {
            pub  child_process: Option<Child>
        }
    }


}

impl Default for ProcessIdAndStatus {
    fn default() -> Self {
        Self {
            child_process: None,
        }
    }
}

impl ProcessIdAndStatus {
    pub fn kill_process(&mut self) -> bool {
        match &mut self.child_process {
            None => {
                return false;
            }
            Some(p) => match p.kill() {
                Err(err) => match err.kind() {
                    ErrorKind::PermissionDenied => {
                        //Permission Denied should only be thrown if the process is already done
                        return false;
                    }
                    _ => {
                        panic!("Could not kill child process: {} \n {}", err, err.kind());
                    }
                },
                Ok(_) => {
                    *self = ProcessIdAndStatus::default();
                    return true;
                }
            },
        }
    }
}

pub struct GlobalSingleton {
    pub child_process: ProcessIdAndStatus,
}

lazy_static! {
    pub static ref GLOBAL_SINGLETON: Mutex<GlobalSingleton> = Mutex::new(GlobalSingleton {
        child_process: ProcessIdAndStatus {
            child_process: None
        }
    });
}
