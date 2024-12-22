use axum::{
    routing::{get, post, put, delete},
    Router,
    Json,
    extract::Path,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{CorsLayer, Any};
use std::collections::HashMap;
use std::net::SocketAddr;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct Project {
    id: String,
    name: String,
    status: String,
    progress: i32,
    description: String,
    start_date: String,
    end_date: String,
}

type ProjectStore = Arc<Mutex<HashMap<String, Project>>>;

#[tokio::main]
async fn main() {
    // トレーシングの初期化
    tracing_subscriber::fmt::init();

    // プロジェクトストアの初期化
    let store = Arc::new(Mutex::new(HashMap::new()));
    
    // CORSの設定
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // ルーターの設定
    let app = Router::new()
        .route("/api/projects", get(list_projects))
        .route("/api/projects", post(create_project))
        .route("/api/projects/:id", get(get_project))
        .route("/api/projects/:id", put(update_project))
        .route("/api/projects/:id", delete(delete_project))
        .layer(cors)
        .with_state(store);

    // サーバーの起動
    let addr = SocketAddr::from(([127, 0, 0, 1], 3002));
    tracing::info!("サーバーを起動します: {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("リスナーを開始します: {}", addr);
    axum::serve(listener, app).await.unwrap();
}

// プロジェクト一覧の取得
async fn list_projects(
    store: axum::extract::State<ProjectStore>,
) -> Json<Vec<Project>> {
    let projects = store.lock().await;
    Json(projects.values().cloned().collect())
}

// プロジェクトの作成
async fn create_project(
    store: axum::extract::State<ProjectStore>,
    Json(project): Json<Project>,
) -> Json<Project> {
    let mut projects = store.lock().await;
    projects.insert(project.id.clone(), project.clone());
    Json(project)
}

// プロジェクトの取得
async fn get_project(
    store: axum::extract::State<ProjectStore>,
    Path(id): Path<String>,
) -> Json<Option<Project>> {
    let projects = store.lock().await;
    Json(projects.get(&id).cloned())
}

// プロジェクトの更新
async fn update_project(
    store: axum::extract::State<ProjectStore>,
    Path(id): Path<String>,
    Json(project): Json<Project>,
) -> Json<Option<Project>> {
    let mut projects = store.lock().await;
    if projects.contains_key(&id) {
        projects.insert(id, project.clone());
        Json(Some(project))
    } else {
        Json(None)
    }
}

// プロジェクトの削除
async fn delete_project(
    store: axum::extract::State<ProjectStore>,
    Path(id): Path<String>,
) -> Json<bool> {
    let mut projects = store.lock().await;
    Json(projects.remove(&id).is_some())
}
