use tauri::ipc::Response;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use tauri_plugin_updater::UpdaterExt;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                update(handle).await.unwrap();
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

async fn update(app: tauri::AppHandle) -> tauri_plugin_updater::Result<()> {
    if let Some(update) = app.updater()?.check().await? {
        let response = app
            .dialog()
            .message("Update Available")
            .title("An update is available. Do you want to update now?")
            .buttons(MessageDialogButtons::OkCancelCustom(
                "Yes".to_string(),
                "No".to_string(),
            ))
            .show(|response| async move {
                if response == "Yes" {
                    let mut downloaded = 0;

                    update
                        .download_and_install(
                            |chunk_length, content_length| {
                                downloaded += chunk_length;
                                tauri::async_runtime::spawn(async move {
                                    app.dialog()
                                        .message("Downloading")
                                        .title(&format!(
                                            "Downloaded {} from {:?}",
                                            downloaded, content_length
                                        ))
                                        .buttons(MessageDialogButtons::Ok)
                                        .show(|_| ());
                                }).await;
                            },
                            || async {
                                app.dialog()
                                    .message("Download Finished")
                                    .title("The download has finished.")
                                    .buttons(MessageDialogButtons::Ok)
                                    .show(|_| ())
                                    .await;
                            },
                        )
                        .await
                        .map_err(|e| e.to_string())?;

                    app.dialog()
                        .message("Update Installed")
                        .title("The update has been installed. The application will now restart.")
                        .buttons(MessageDialogButtons::Ok)
                        .show(|_| ());
                    app.restart();
                }
            });
    }

    Ok(())
}