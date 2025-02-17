use tauri_plugin_dialog;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let handle = app.handle();
            tauri::async_runtime::spawn(async move {
                let updater = handle.updater();
                if let Ok(update) = updater.check().await {
                    if update.is_update_available() {
                        tauri_plugin_dialog::message(Some(&handle), "Update Available", "A new update is available. Would you like to update now?");
                        if let Ok(_) = updater.install().await {
                            tauri_plugin_dialog::message(Some(&handle), "Update Installed", "The update was installed successfully. Please restart the application.");
                        } else {
                            tauri_plugin_dialog::message(Some(&handle), "Update Failed", "The update failed to install.");
                        }
                    }
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
