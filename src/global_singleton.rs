use std::{io::ErrorKind, process::Child, sync::Mutex};

pub struct GlobalSingleton {
    pub processes: Vec<*mut Child>,
}

impl GlobalSingleton {
    pub fn kill_all_processes(&mut self) {
        for ele in &self.processes {
            unsafe {
                match ele.as_mut().unwrap().kill() {
                    Err(err) => match err.kind() {
                        ErrorKind::PermissionDenied => {
                            //Permission Denied should only be thrown if the process is already done
                            println!(
                                "Permission to kill child process denied: {} \n {}",
                                err,
                                err.kind()
                            );
                        }
                        _ => {
                            println!("Could not kill child process: {} \n {}", err, err.kind());
                        }
                    },
                    Ok(_) => {}
                }
            }
        }
    }
}

pub static mut GLOBAL_SINGLETON: Mutex<GlobalSingleton> = Mutex::new(GlobalSingleton {
    processes: Vec::new(),
});
