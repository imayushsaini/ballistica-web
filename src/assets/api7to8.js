function convert(content) {
  content = content.replaceAll(
    "# ba_meta require api 7",
    "# ba_meta require api 8",
  );
  content = content.replaceAll(
    "# ba_meta export game",
    "# ba_meta export bascenev1.GameActivity",
  );

  content = content.replaceAll(
    "# ba_meta require api 6",
    "# ba_meta require api 8",
  );
  content = content.replaceAll("on_app_launch", "__init__");
  content = content.replaceAll("ba._enums", "ba._generated.enums");
  content = content.replaceAll("get_account", "get_v1_account");

  content = content.replaceAll("user_agent_string", "legacy_user_agent_string");
  content = content.replaceAll(
    /^(import\s+[\w]+(\s*,\s*[\w]+)+)/gm,
    (match) => {
      return match.replaceAll(/\s*,\s*/g, "\nimport ");
    },
  );
  content = content.replaceAll(/_ba\./g, "_babase.");

  content = content.replaceAll("ba.", "babase.");
  content = content.replaceAll("import _ba", "import _babase");
  content = content.replaceAll("from ba import", "from babase import");
  content = content.replaceAll("from _ba import", "from _babase import");
  content = content.replaceAll(/\bimport _ba\b/g, "import _babase");
  content = content.replaceAll(
    /\bimport ba(\b|\.\w+)/g,
    "import babase\nimport bauiv1\nimport bascenev1",
  );
  let match = content.match(/^(import\s+[\w]+(\s*,\s*[\w]+)*)/gm);
  let affected_methods = [
    "build_number",
    "device_name",
    "config_file_path",
    "version",
    "debug_build",
    "test_build",
    "data_directory",
    "python_directory_user",
    "python_directory_app",
    "python_directory_app_site",
    "api_version",
    "on_tv",
    "vr_mode",
    "toolbar_test",
    "arcade_test",
    "headless_mode",
    "demo_mode",
    "protocol_version",
    "get_connection_to_host_info",
  ];

  for (let word of affected_methods) {
    if (content.includes(`.${word}`)) {
      let first_import_index = content.indexOf(match[0]);
      content =
        content.slice(0, first_import_index) +
        "from baenv import TARGET_BALLISTICA_BUILD as build_number\n" +
        content.slice(first_import_index);
      break;
    }
  }
  content = content.replaceAll("babase.app.ui", "bauiv1.app.ui_v1");
  content = content.replaceAll(
    "babase.app.accounts_v1",
    "bauiv1.app.classic.accounts",
  );
  // LET ADD SUPPORT FOR CLEINT MDOS LATER   TODO
  // following is server mods conversion
  content = content.replaceAll(
    "_babase.screenmessage",
    "bascenev1.broadcastmessage",
  );
  content = content.replaceAll(
    "babase.screenmessage",
    "bascenev1.broadcastmessage",
  );
  content = content.replaceAll("babase.getsound", "bascenev1.getsound");
  content = content.replaceAll("_babase.gettexture", "bascenev1.gettexture");
  content = content.replaceAll("babase.gettexture", "bascenev1.gettexture");
  content = content.replaceAll("babase.getmesh", "bascenev1.getmesh");
  content = content.replaceAll(
    "babase.getcollisionmesh",
    "bascenev1.getcollisionmesh",
  );
  content = content.replaceAll(
    "babase.getcollidemesh",
    "bascenev1.getcollisionmesh",
  );
  content = content.replaceAll("collide_mesh", "collision_mesh");
  content = content.replaceAll("babase.open_url", "bauiv1.open_url");
  content = content.replaceAll("babase.IntSetting", "bascenev1.IntSetting");
  content = content.replaceAll(
    "babase.IntChoiceSetting",
    "bascenev1.IntChoiceSetting",
  );
  content = content.replaceAll(
    "babase.FloatChoiceSetting",
    "bascenev1.FloatChoiceSetting",
  );
  content = content.replaceAll("babase.BoolSetting", "bascenev1.BoolSetting");
  content = content.replaceAll("babase.Actor", "bascenev1.Actor");
  content = content.replaceAll("babase.Player", "bascenev1.Player");
  content = content.replaceAll(
    "babase.PlayerDiedMessage",
    "bascenev1.PlayerDiedMessage",
  );
  content = content.replaceAll("babase.time", "bascenev1.time");
  content = content.replaceAll("babase.Timer", "bascenev1.Timer");
  content = content.replaceAll("babase.newnode", "bascenev1.newnode");
  content = content.replaceAll("babase.Node", "bascenev1.Node");
  content = content.replaceAll("babase.emitfx", "bascenev1.emitfx");
  content = content.replaceAll("babase.animate", "bascenev1.animate");
  content = content.replaceAll(
    "babase.FreeForAllSession",
    "bascenev1.FreeForAllSession",
  );
  content = content.replaceAll(
    "babase.DualTeamSession",
    "bascenev1.DualTeamSession",
  );
  content = content.replaceAll(
    "babase.MultiTeamSession",
    "bascenev1.MultiTeamSession",
  );
  content = content.replaceAll("babase.EndSession", "bascenev1.EndSession");
  content = content.replaceAll("babase.CoopSession", "bascenev1.CoopSession");
  content = content.replaceAll(
    "babase.TeamGameActivity",
    "bascenev1.TeamGameActivity",
  );
  content = content.replaceAll("babase.Team", "bascenev1.Team");
  content = content.replaceAll("babase.Session", "bascenev1.Session");
  content = content.replaceAll("babase.getsession", "bascenev1.getsession");
  content = content.replaceAll("babase.Material", "bascenev1.Material");
  content = content.replaceAll("babase.WeakCall", "bascenev1.WeakCall");
  content = content.replaceAll("babase.DieMessage", "bascenev1.DieMessage");
  content = content.replaceAll(
    "babase.OutOfBoundsMessage",
    "bascenev1.OutOfBoundsMessage",
  );
  content = content.replaceAll(
    "babase.DroppedMessage",
    "bascenev1.DroppedMessage",
  );
  content = content.replaceAll("babase.HitMessage", "bascenev1.HitMessage");
  content = content.replaceAll("babase.ThawMessage", "bascenev1.ThawMessage");
  content = content.replaceAll(
    "babase.NotFoundError",
    "bascenev1.NotFoundError",
  );
  content = content.replaceAll("babase.getcollision", "bascenev1.getcollision");
  content = content.replaceAll("babase.app.lang", "bascenev1.app.lang");
  content = content.replaceAll("babase.MusicType", "bascenev1.MusicType");
  content = content.replaceAll("babase.getactivity", "bascenev1.getactivity");
  content = content.replaceAll("babase.getactivity", "bascenev1.getactivity");
  content = content.replaceAll(
    "babase.CelebrateMessage",
    "bascenev1.CelebrateMessage",
  );
  content = content.replaceAll("babase.ScoreConfig", "bascenev1.ScoreConfig");
  content = content.replaceAll("babase.ScoreType", "bascenev1.ScoreType");
  content = content.replaceAll("babase.GameResults", "bascenev1.GameResults");
  content = content.replaceAll(
    "babase.getmaps",
    "bascenev1.app.classic.getmaps",
  );
  content = content.replaceAll("babase.cameraflash", "bascenev1.cameraflash");
  content = content.replaceAll("babase.getmodel", "bascenev1.getmesh");
  content = content.replaceAll("babase.Map", "bascenev1.Map");
  content = content.replaceAll("babase.DeathType", "bascenev1.DeathType");
  content = content.replaceAll("babase.GameActivity", "bascenev1.GameActivity");
  content = content.replaceAll(
    "_babase.app.stress_test_reset_timer",
    "_babase.app.classic.stress_test_reset_timer",
  );
  content = content.replaceAll(
    "babase.app.stress_test_reset_timer",
    "_babase.app.classic.stress_test_reset_timer",
  );
  content = content.replaceAll("babase._map", "bascenev1._map");
  content = content.replaceAll("babase._session.", "bascenev1._session.");
  content = content.replaceAll("babase._activity", "bascenev1._activity");
  content = content.replaceAll(
    "_babase.get_client_public_device_uuid",
    "_bascenev1.get_client_public_device_uuid",
  );
  content = content.replaceAll(
    "babase.PickedUpMessage",
    "bascenev1.PickedUpMessage",
  );
  content = content.replaceAll(
    "babase.PowerupMessage",
    "bascenev1.PowerupMessage",
  );
  content = content.replaceAll(
    "babase.FreezeMessage",
    "bascenev1.FreezeMessage",
  );
  content = content.replaceAll(
    "with babase.ContextRef(activity):",
    "with activity.context:",
  );
  content = content.replaceAll("babase.Context", "babase.ContextRef");
  content = content.replaceAll(
    "babase._dualteamsession",
    "bascenev1._dualteamsession",
  );
  content = content.replaceAll(
    "babase._freeforallsession",
    "bascenev1._freeforallsession",
  );
  content = content.replaceAll(
    "babase._multiteamsession",
    "bascenev1._multiteamsession",
  );
  content = content.replaceAll(
    "babase._gameactivity",
    "bascenev1._gameactivity",
  );
  content = content.replaceAll("babase._powerup", "bascenev1._powerup");
  content = content.replaceAll("babase.Chooser", "bascenev1.Chooser");
  content = content.replaceAll("babase._lobby", "bascenev1._lobby");
  content = content.replaceAll("babase._stats", "bascenev1._stats");
  content = content.replaceAll("babase._team", "bascenev1._team");
  content = content.replaceAll("PlayerType", "PlayerT");
  content = content.replaceAll(
    "babase.app.spaz_appearances",
    "babase.app.classic.spaz_appearances",
  );
  content = content.replaceAll("babase._coopsession", "bascenev1._coopsession");
  content = content.replaceAll("babase._servermode", "baclassic._servermode");
  content = content.replaceAll(
    "_babase.app.server",
    "babase.app.classic.server",
  );
  content = content.replaceAll("_babase.chatmessage", "bascenev1.chatmessage");
  content = content.replaceAll(
    "_babase.disconnect_client",
    "_bascenev1.disconnect_client",
  );
  content = content.replaceAll(
    "_babase.get_game_roster",
    "bascenev1.get_game_roster",
  );
  content = content.replaceAll(
    "_babase.get_public_party_max_size",
    "bascenev1.get_public_party_max_size",
  );
  content = content.replaceAll(
    "_babase.new_host_session",
    "bascenev1.new_host_session",
  );
  content = content.replaceAll("babase._playlist", "bascenev1._playlist");
  content = content.replaceAll("model", "mesh");
  content = content.replaceAll(
    "TimeType.REAL",
    "use `bascenev1.apptimer` in `activity.context` instead",
  );
  content = content.replaceAll(
    "_babase.app.coop_session_args",
    "babase.app.classic.coop_session_args",
  );
  content = content.replaceAll(
    "_babase.app.campaigns",
    "babase.app.classic.campaigns",
  );

  content = content.replaceAll("_babase.newactivity", "bascenev1.newactivity");
  content = content.replaceAll("babase.Window", "bauiv1.Window");
  content = content.replaceAll("babase.Widget", "bauiv1.Widget");
  content = content.replaceAll("babase.widget", "bauiv1.widget");
  content = content.replaceAll(
    "babase.containerwidget",
    "bauiv1.containerwidget",
  );
  content = content.replaceAll("babase.scrollwidget", "bauiv1.scrollwidget");
  content = content.replaceAll("babase.buttonwidget", "bauiv1.buttonwidget");
  content = content.replaceAll("babase.textwidget", "bauiv1.textwidget");
  content = content.replaceAll(
    "babase.checkboxwidget",
    "bauiv1.checkboxwidget",
  );
  content = content.replaceAll("babase.imagewidget", "bauiv1.imagewidget");
  content = content.replaceAll(
    "babase.uicleanupcheck",
    "bauiv1.uicleanupcheck",
  );
  content = content.replaceAll(
    "_babase.set_public_party_max_size",
    "bascenev1.set_public_party_max_size",
  );
  content = content.replaceAll("_bauiv1", "bauiv1");
  content = content.replaceAll(
    "babase.show_damage_count",
    "bascenev1.show_damage_count",
  );
  content = content.replaceAll("babase._gameutils", "bascenev1._gameutils");
  content = content.replaceAll("babase.StandMessage", "bascenev1.StandMessage");
  content = content.replaceAll(
    "babase.PowerupAcceptMessage",
    "bascenev1.PowerupAcceptMessage",
  );
  content = content.replaceAll("babase._gameutils", "bascenev1._gameutils");
  content = content.replaceAll("babase.camerashake", "bascenev1.camerashake");
  content = content.replaceAll(
    "babase.app.add_coop_practice_level",
    "babase.app.classic.add_coop_practice_level",
  );
  content = content.replaceAll("babase._campaign", "bascenev1._campaign");
  content = content.replaceAll("babase.Level", "bascenev1._level.Level");
  content = content.replaceAll(
    "babase.app.cloud.send_message_cb",
    "bauiv1.app.plus.cloud.send_message_cb",
  );
  content = content.replaceAll(
    "_babase.get_special_widget",
    "bauiv1.get_special_widget",
  );

  content = content.replaceAll(".app.platform", ".app.classic.platform");
  content = content.replaceAll(".app.subplatform", ".app.classic.subplatform");
  content = content.replaceAll(".getlog", ".get_v1_cloud_log");

  content = content.replaceAll(
    /babase\.playsound\(([^,\n]+)(,\s*([^,\n]+))?(,\s*position=([^,\n]+))?\)/gm,
    "$1.play($3$5)",
  );
  content = content.replaceAll(
    "babase.internal.add_transaction",
    "bauiv1.app.plus.add_v1_account_transaction",
  );
  content = content.replaceAll(
    "babase.internal.run_transaction",
    "bauiv1.app.plus.run_v1_account_transaction",
  );
  content = content.replaceAll(
    "_babase.add_transaction",
    "bauiv1.app.plus.add_v1_account_transaction",
  );
  content = content.replaceAll(
    "_babase.run_transactions",
    "bauiv1.app.plus.run_v1_account_transactions",
  );
  content = content.replaceAll(
    "babase._store.get_store_layout",
    "bauiv1.app.classic.store.get_store_layout",
  );
  content = content.replaceAll(
    "babase.internal.get_store_layout",
    "bauiv1.app.classic.store.get_store_layout",
  );
  content = content.replaceAll(
    "babase.internal.connect_to_party",
    "bascenev1.connect_to_party",
  );
  content = content.replaceAll(
    "babase.internal.get_default_powerup_distribution",
    "bascenev1._powerup.get_default_powerup_distribution",
  );
  content = content.replaceAll(
    "babase.internal.DEFAULT_REQUEST_TIMEOUT_SECONDS",
    "babase.DEFAULT_REQUEST_TIMEOUT_SECONDS",
  );
  content = content.replaceAll(
    "babase.internal.DEFAULT_TEAM_COLORS",
    "bascenev1.DEFAULT_TEAM_COLORS",
  );
  content = content.replaceAll(
    "babase.internal.DEFAULT_TEAM_NAMES",
    "bascenev1.DEFAULT_TEAM_NAMES",
  );
  content = content.replaceAll(
    "babase.internal.JoinActivity",
    "bascenev1.JoinActivity",
  );
  content = content.replaceAll(
    "babase.internal.LoginAdapter",
    "babase._login.LoginAdapter",
  );
  content = content.replaceAll(
    "babase.internal.PlayerProfilesChangedMessage",
    "bascenev1._messages.PlayerProfilesChangedMessage",
  );
  content = content.replaceAll(
    "babase.internal.ScoreScreenActivity",
    "bascenev1.ScoreScreenActivity",
  );
  content = content.replaceAll(
    "babase.internal.add_clean_frame_callback",
    "babase.add_clean_frame_callback",
  );
  content = content.replaceAll(
    "babase.internal.android_get_external_files_dir",
    "babase.android_get_external_files_dir",
  );
  content = content.replaceAll("babase.internal.appname", "babase.appname");
  content = content.replaceAll(
    "babase.internal.appnameupper",
    "babase.appnameupper",
  );
  content = content.replaceAll(
    "babase.internal.capture_gamepad_input",
    "bascenev1.capture_gamepad_input",
  );
  content = content.replaceAll(
    "babase.internal.capture_keyboard_input",
    "bascenev1.capture_keyboard_input",
  );
  content = content.replaceAll("babase.internal.charstr", "babase.charstr");
  content = content.replaceAll(
    "babase.internal.chatmessage",
    "bascenev1.chatmessage",
  );
  content = content.replaceAll(
    "babase.internal.commit_app_config",
    "bauiv1.commit_app_config",
  );
  content = content.replaceAll(
    "babase.internal.disconnect_client",
    "bascenev1.disconnect_client",
  );
  content = content.replaceAll(
    "babase.internal.disconnect_from_host",
    "bascenev1.disconnect_from_host",
  );
  content = content.replaceAll(
    "babase.internal.do_play_music",
    "babase.app.classic.music.do_play_music",
  );
  content = content.replaceAll(
    "babase.internal.end_host_scanning",
    "bascenev1.end_host_scanning",
  );
  content = content.replaceAll(
    "babase.internal.fade_screen",
    "bauiv1.fade_screen",
  );
  content = content.replaceAll(
    "babase.internal.filter_playlist",
    "bascenev1.filter_playlist",
  );
  content = content.replaceAll(
    "babase.internal.game_service_has_leaderboard",
    "_baplus.game_service_has_leaderboard",
  );
  content = content.replaceAll(
    "babase.internal.get_available_purchase_count",
    "bauiv1.app.classic.store.get_available_purchase_count",
  );
  content = content.replaceAll(
    "babase.internal.get_available_sale_time",
    "bauiv1.app.classic.store.get_available_sale_time",
  );
  content = content.replaceAll(
    "babase.internal.get_chat_messages",
    "bascenev1.get_chat_messages",
  );
  content = content.replaceAll(
    "babase.internal.get_clean_price",
    "bauiv1.app.classic.store.get_clean_price",
  );
  content = content.replaceAll(
    "babase.internal.get_connection_to_host_info",
    "bascenev1.get_connection_to_host_info",
  );
  content = content.replaceAll(
    "babase.internal.get_default_free_for_all_playlist",
    "bascenev1._playlist.get_default_free_for_all_playlist",
  );
  content = content.replaceAll(
    "babase.internal.get_default_teams_playlist",
    "bascenev1._playlist.get_default_teams_playlist",
  );
  content = content.replaceAll(
    "babase.internal.get_display_resolution",
    "babase.get_display_resolution",
  );
  content = content.replaceAll(
    "babase.internal.get_filtered_map_name",
    "bascenev1._map.get_filtered_map_name",
  );
  content = content.replaceAll(
    "babase.internal.get_foreground_host_session",
    "bascenev1.get_foreground_host_session",
  );
  content = content.replaceAll(
    "babase.internal.get_game_port",
    "bascenev1.get_game_port",
  );
  content = content.replaceAll(
    "babase.internal.get_game_roster",
    "bascenev1.get_game_roster",
  );
  content = content.replaceAll(
    "babase.internal.get_input_device_config",
    "bauiv1.app.classic.get_input_device_config",
  );
  content = content.replaceAll(
    "babase.internal.get_ip_address_type",
    "babase.get_ip_address_type",
  );
  content = content.replaceAll(
    "babase.internal.get_local_active_input_devices_count",
    "bascenev1.get_local_active_input_devices_count",
  );
  content = content.replaceAll(
    "babase.internal.get_low_level_config_value",
    "bauiv1.get_low_level_config_value",
  );
  content = content.replaceAll(
    "babase.internal.get_map_class",
    "bascenev1.get_map_class",
  );
  content = content.replaceAll(
    "babase.internal.get_map_display_string",
    "bascenev1.get_map_display_string",
  );
  content = content.replaceAll(
    "babase.internal.get_master_server_address",
    "bauiv1.app.plus.get_master_server_address",
  );
  content = content.replaceAll(
    "babase.internal.get_max_graphics_quality",
    "babase.get_max_graphics_quality",
  );
  content = content.replaceAll(
    "babase.internal.get_news_show",
    "_babase.app.plus.get_news_show",
  );
  content = content.replaceAll(
    "babase.internal.get_next_tip",
    "bascenev1.app.classic.get_next_tip",
  );
  content = content.replaceAll(
    "babase.internal.get_player_colors",
    "bascenev1.get_player_colors",
  );
  content = content.replaceAll(
    "babase.internal.get_player_profile_colors",
    "bascenev1.get_player_profile_colors",
  );
  content = content.replaceAll(
    "babase.internal.get_player_profile_icon",
    "bascenev1.get_player_profile_icon",
  );
  content = content.replaceAll(
    "babase.internal.get_price",
    "bauiv1.app.plus.get_price",
  );
  content = content.replaceAll(
    "babase.internal.get_public_party_enabled",
    "bascenev1.get_public_party_enabled",
  );
  content = content.replaceAll(
    "babase.internal.get_public_party_max_size",
    "bascenev1.get_public_party_max_size",
  );
  content = content.replaceAll(
    "babase.internal.get_purchased",
    "bauiv1.app.plus.get_purchased",
  );
  content = content.replaceAll(
    "babase.internal.get_purchases_state",
    "_baplus.get_purchases_state",
  );
  content = content.replaceAll(
    "babase.internal.get_qrcode_texture",
    "bauiv1.get_qrcode_texture",
  );
  content = content.replaceAll(
    "babase.internal.get_random_names",
    "bascenev1.get_random_names",
  );
  content = content.replaceAll(
    "babase.internal.get_remote_app_name",
    "bascenev1.get_remote_app_name",
  );
  content = content.replaceAll(
    "babase.internal.get_replay_speed_exponent",
    "bascenev1.get_replay_speed_exponent",
  );
  content = content.replaceAll(
    "babase.internal.get_replays_dir",
    "babase.get_replays_dir",
  );
  content = content.replaceAll(
    "babase.internal.get_special_widget",
    "bauiv1.get_special_widget",
  );
  content = content.replaceAll(
    "babase.internal.get_store_item",
    "babase.app.classic.store.get_store_item",
  );
  content = content.replaceAll(
    "babase.internal.get_store_item_display_size",
    "babase.app.classic.store.get_store_item_display_size",
  );
  content = content.replaceAll(
    "babase.internal.get_store_item_name_translated",
    "babase.app.classic.store.get_store_item_name_translated",
  );
  content = content.replaceAll(
    "babase.internal.get_string_height",
    "babase.get_string_height",
  );
  content = content.replaceAll(
    "babase.internal.get_string_width",
    "babase.get_string_width",
  );
  content = content.replaceAll(
    "babase.internal.get_tournament_prize_strings",
    "bascenev1.app.classic.get_tournament_prize_strings",
  );
  content = content.replaceAll(
    "babase.internal.get_trophy_string",
    "bascenev1.get_trophy_string",
  );
  content = content.replaceAll(
    "babase.internal.get_type_name",
    "babase.get_type_name",
  );
  content = content.replaceAll(
    "babase.internal.get_ui_input_device",
    "bascenev1.get_ui_input_device",
  );
  content = content.replaceAll(
    "babase.internal.get_unowned_game_types",
    "babase.app.classic.store.get_unowned_game_types",
  );
  content = content.replaceAll(
    "babase.internal.get_unowned_maps",
    "babase.app.classic.store.get_unowned_maps",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_display_string",
    "bauiv1.app.plus.get_v1_account_display_string",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_misc_read_val",
    "bauiv1.app.plus.get_v1_account_misc_read_val",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_misc_read_val_2",
    "bauiv1.app.plus.get_v1_account_misc_read_val_2",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_misc_val",
    "bauiv1.app.plus.get_v1_account_misc_val",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_name",
    "bauiv1.app.plus.get_v1_account_name",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_state",
    "bauiv1.app.plus.get_v1_account_state",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_state_num",
    "bauiv1.app.plus.get_v1_account_state_num",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_ticket_count",
    "bauiv1.app.plus.get_v1_account_ticket_count",
  );
  content = content.replaceAll(
    "babase.internal.get_v1_account_type",
    "bauiv1.app.plus.get_v1_account_type",
  );
  content = content.replaceAll(
    "babase.internal.get_v2_fleet",
    "_baplus.get_v2_fleet",
  );
  content = content.replaceAll(
    "babase.internal.getcampaign",
    "bauiv1.app.classic.getcampaign",
  );
  content = content.replaceAll("babase.internal.getclass", "babase.getclass");
  content = content.replaceAll(
    "babase.internal.getinputdevice",
    "bascenev1.getinputdevice",
  );
  content = content.replaceAll(
    "babase.internal.has_gamma_control",
    "babase.has_gamma_control",
  );
  content = content.replaceAll(
    "babase.internal.has_video_ads",
    "bauiv1.has_video_ads",
  );
  content = content.replaceAll(
    "babase.internal.have_incentivized_ad",
    "bauiv1.have_incentivized_ad",
  );
  content = content.replaceAll(
    "babase.internal.have_permission",
    "babase.have_permission",
  );
  content = content.replaceAll(
    "babase.internal.have_touchscreen_input",
    "bascenev1.have_touchscreen_input",
  );
  content = content.replaceAll(
    "babase.internal.host_scan_cycle",
    "bascenev1.host_scan_cycle",
  );
  content = content.replaceAll(
    "babase.internal.in_game_purchase",
    "bui.app.plus.in_game_purchase",
  );
  content = content.replaceAll(
    "babase.internal.increment_analytics_count",
    "babase.increment_analytics_count",
  );
  content = content.replaceAll(
    "babase.internal.is_blessed",
    "bui.app.plus.is_blessed",
  );
  content = content.replaceAll(
    "babase.internal.is_browser_likely_available",
    "bauiv1.is_browser_likely_available",
  );
  content = content.replaceAll(
    "babase.internal.is_in_replay",
    "bascenev1.is_in_replay",
  );
  content = content.replaceAll(
    "babase.internal.is_party_icon_visible",
    "bauiv1.is_party_icon_visible",
  );
  content = content.replaceAll(
    "babase.internal.is_running_on_fire_tv",
    "babase.is_running_on_fire_tv",
  );
  content = content.replaceAll(
    "babase.internal.is_xcode_build",
    "babase.is_xcode_build",
  );
  content = content.replaceAll("babase.internal.json_prep", "babase.json_prep");
  content = content.replaceAll(
    "babase.internal.lock_all_input",
    "babase.lock_all_input",
  );
  content = content.replaceAll(
    "babase.internal.mark_config_dirty",
    "_babase.app.plus.mark_config_dirty",
  );
  content = content.replaceAll(
    "babase.internal.new_host_session",
    "bascenev1.new_host_session",
  );
  content = content.replaceAll(
    "babase.internal.new_replay_session",
    "bascenev1.new_replay_session",
  );
  content = content.replaceAll(
    "babase.internal.open_file_externally",
    "bauiv1.open_file_externally",
  );
  content = content.replaceAll(
    "babase.internal.power_ranking_query",
    "_baplus.power_ranking_query",
  );
  content = content.replaceAll(
    "babase.internal.preload_map_preview_media",
    "bauiv1.app.classic.preload_map_preview_media",
  );
  content = content.replaceAll("babase.internal.purchase", "_baplus.purchase");
  content = content.replaceAll(
    "babase.internal.register_map",
    "bascenev1.register_map",
  );
  content = content.replaceAll(
    "babase.internal.release_gamepad_input",
    "bascenev1.release_gamepad_input",
  );
  content = content.replaceAll(
    "babase.internal.release_keyboard_input",
    "bascenev1.release_keyboard_input",
  );
  content = content.replaceAll(
    "babase.internal.report_achievement",
    "babase.app.plus.report_achievement",
  );
  content = content.replaceAll(
    "babase.internal.request_permission",
    "babase.request_permission",
  );
  content = content.replaceAll(
    "babase.internal.reset_achievements",
    "_baplus.reset_achievements",
  );
  content = content.replaceAll(
    "babase.internal.reset_random_player_names",
    "bascenev1.reset_random_player_names",
  );
  content = content.replaceAll(
    "babase.internal.restore_purchases",
    "_baplus.restore_purchases",
  );
  content = content.replaceAll(
    "babase.internal.run_cpu_benchmark",
    "baclassic._benchmark.run_cpu_benchmark",
  );
  content = content.replaceAll(
    "babase.internal.run_gpu_benchmark",
    "baclassic._benchmark.run_gpu_benchmark",
  );
  content = content.replaceAll(
    "babase.internal.run_media_reload_benchmark",
    "baclassic._benchmark.run_media_reload_benchmark",
  );
  content = content.replaceAll(
    "babase.internal.run_stress_test",
    "babase.app.classic.run_stress_test",
  );
  content = content.replaceAll(
    "babase.internal.set_authenticate_clients",
    "bascenev1.set_authenticate_clients",
  );
  content = content.replaceAll(
    "babase.internal.set_debug_speed_exponent",
    "bascenev1.set_debug_speed_exponent",
  );
  content = content.replaceAll(
    "babase.internal.set_low_level_config_value",
    "babase.set_low_level_config_value",
  );
  content = content.replaceAll(
    "babase.internal.set_party_icon_always_visible",
    "bauiv1.set_party_icon_always_visible",
  );
  content = content.replaceAll(
    "babase.internal.set_party_window_open",
    "bauiv1.set_party_window_open",
  );
  content = content.replaceAll(
    "babase.internal.set_public_party_enabled",
    "bascenev1.set_public_party_enabled",
  );
  content = content.replaceAll(
    "babase.internal.set_public_party_max_size",
    "bascenev1.set_public_party_max_size",
  );
  content = content.replaceAll(
    "babase.internal.set_public_party_name",
    "bascenev1.set_public_party_name",
  );
  content = content.replaceAll(
    "babase.internal.set_public_party_queue_enabled",
    "bascenev1.set_public_party_queue_enabled",
  );
  content = content.replaceAll(
    "babase.internal.set_replay_speed_exponent",
    "bascenev1.set_replay_speed_exponent",
  );
  content = content.replaceAll(
    "babase.internal.set_touchscreen_editing",
    "bascenev1.set_touchscreen_editing",
  );
  content = content.replaceAll(
    "babase.internal.set_ui_input_device",
    "babase.set_ui_input_device",
  );
  content = content.replaceAll(
    "babase.internal.should_submit_debug_info",
    "babase._apputils.should_submit_debug_info",
  );
  content = content.replaceAll(
    "babase.internal.show_online_score_ui",
    "bauiv1.show_online_score_ui",
  );
  content = content.replaceAll(
    "babase.internal.sign_in_v1",
    "babase.app.plus.sign_in_v1",
  );
  content = content.replaceAll(
    "babase.internal.sign_out_v1",
    "babase.app.plus.sign_out_v1",
  );
  content = content.replaceAll(
    "babase.internal.submit_score",
    "bascenev1.app.plus.submit_score",
  );
  content = content.replaceAll(
    "babase.internal.tournament_query",
    "_baplus.tournament_query",
  );
  content = content.replaceAll(
    "babase.internal.unlock_all_input",
    "babase.unlock_all_input",
  );
  content = content.replaceAll(
    "babase.internal.value_test",
    "bauiv1.app.classic.value_test",
  );
  content = content.replaceAll(
    "babase.internal.workspaces_in_use",
    "babase.workspaces_in_use",
  );
  content = content.replaceAll(
    "babase.internal.dump_tracebacks",
    "babase._apputils.dump_app_state",
  );
  content = content.replaceAll(
    "babase.internal.show_app_invite",
    "_bauiv1.show_app_invite",
  );
  content = content.replaceAll(
    "babase.internal.master_server_get",
    "babase.app.classic.master_server_v1_get",
  );
  content = content.replaceAll(
    "babase.internal.master_server_post",
    "babase.app.classic.master_server_v1_post",
  );
  content = content.replaceAll(
    "babase.internal.log_dumped_tracebacks",
    "babase._apputils.log_dumped_app_state",
  );
  content = content.replaceAll(
    "babase.internal.have_outstanding_transactions",
    "bauiv1.app.plus.have_outstanding_v1_account_transactions",
  );
  content = content.replaceAll(
    "babase.internal.get_public_login_id",
    "bauiv1.app.plus.get_v1_account_public_login_id",
  );
  content = content.replaceAll(
    "babase.internal.get_input_map_hash",
    "bauiv1.app.classic.get_input_device_map_hash",
  );
  content = content.replaceAll(
    "babase.internal.get_device_value",
    "bauiv1.app.classic.get_input_device_mapped_value",
  );
  content = content.replaceAll("babase.internal.", "bascenev1");

  content = content.replaceAll("babase._generated", "babase._mgen");
  content = content.replaceAll(
    "_babase.disconnect_from_host",
    "bascenev1.disconnect_from_host",
  );
  content = content.replaceAll(
    "babase.disconnect_from_host",
    "bascenev1.disconnect_from_host",
  );
  content = content.replaceAll(
    "_babase.connect_to_party",
    "bascenev1.connect_to_party",
  );
  content = content.replaceAll(
    "babase.connect_to_party",
    "bascenev1.connect_to_party",
  );
  content = content.replaceAll(
    "babase.set_party_window_open",
    "bauiv1.set_party_window_open",
  );
  content = content.replaceAll(
    "babase.set_party_window_open",
    "bauiv1.set_party_window_open",
  );
  content = content.replaceAll(
    "babase.getcollidemesh",
    "bascenev1.getcollisionmesh",
  );
  content = content.replaceAll("collide_mesh", "collision_mesh");
  content = content.replaceAll("babase.FloatSetting", "bascenev1.FloatSetting");
  content = content.replaceAll("babase.playsound", "bascenev1.playsound");
  content = content.replaceAll(
    "bascenev1.time(timeformat=babase.TimeFormat.MILLISECONDS)",
    "bascenev1.time() * 1000",
  );

  content = content.replaceAll(
    "babase.app.build_number",
    "babase.app.build_number if build_number < 21282 else babase.app.env.build_number",
  );
  content = content.replaceAll(
    "babase.app.device_name",
    "babase.app.device_name if build_number < 21282 else babase.app.env.device_name",
  );
  content = content.replaceAll(
    "babase.app.config_file_path",
    "babase.app.config_file_path if build_number < 21282 else babase.app.env.config_file_path",
  );
  content = content.replaceAll(
    "babase.app.version",
    "babase.app.version if build_number < 21282 else babase.app.env.version",
  );
  content = content.replaceAll(
    "babase.app.debug_build",
    "babase.app.debug_build if build_number < 21282 else babase.app.env.debug",
  );
  content = content.replaceAll(
    "babase.app.test_build",
    "babase.app.test_build if build_number < 21282 else babase.app.env.test",
  );
  content = content.replaceAll(
    "babase.app.data_directory",
    "babase.app.data_directory if build_number < 21282 else babase.app.env.data_directory",
  );
  content = content.replaceAll(
    "babase.app.python_directory_user",
    "babase.app.python_directory_user if build_number < 21282 else babase.app.env.python_directory_user",
  );
  content = content.replaceAll(
    "babase.app.python_directory_app",
    "babase.app.python_directory_app if build_number < 21282 else babase.app.env.python_directory_app",
  );
  content = content.replaceAll(
    "babase.app.python_directory_app_site",
    "babase.app.python_directory_app_site if build_number < 21282 else babase.app.env.python_directory_app_site",
  );
  content = content.replaceAll(
    "babase.app.api_version",
    "babase.app.api_version if build_number < 21282 else babase.app.env.api_version",
  );
  content = content.replaceAll(
    "babase.app.on_tv",
    "babase.app.on_tv if build_number < 21282 else babase.app.env.tv",
  );
  content = content.replaceAll(
    "babase.app.vr_mode",
    "babase.app.vr_mode if build_number < 21282 else babase.app.env.vr",
  );
  content = content.replaceAll(
    "babase.app.toolbar_test",
    "babase.app.toolbar_test if build_number < 21282 else _bauiv1.toolbar_test",
  );
  content = content.replaceAll(
    "babase.app.arcade_mode",
    "babase.app.arcade_mode if build_number < 21282 else babase.app.env.arcade",
  );
  content = content.replaceAll(
    "babase.app.headless_mode",
    "babase.app.headless_mode if build_number < 21282 else babase.app.env.headless",
  );
  content = content.replaceAll(
    "babase.app.demo_mode",
    "babase.app.demo_mode if build_number < 21282 else babase.app.env.demo",
  );
  content = content.replaceAll(
    "babase.app.protocol_version",
    "babase.app.protocol_version if build_number < 21282 else bascenev1.protocol_version",
  );
  content = content.replaceAll(
    "bascenev1.get_connection_to_host_info",
    "bascenev1.get_connection_to_host_info if build_number < 21727 else bascenev1.get_connection_to_host_info_2",
  );

  content = content.replaceAll("babase._store", "bauiv1.app.classic.store");
  content = content.replaceAll("bastd.ui", "bauiv1lib");
  content = content.replaceAll("bastd", "bascenev1lib");
  content = content.replaceAll("timetype=", "");
  content = content.replaceAll("babase.columnwidget", "bauiv1.columnwidget");
  content = content.replaceAll(
    "_babase.get_game_port",
    "bascenev1.get_game_port",
  );
  content = content.replaceAll(
    "_babase.get_chat_messages",
    "bascenev1.get_chat_messages",
  );
  content = content.replaceAll(
    "_babase.get_foreground_host_session",
    "bascenev1.get_foreground_host_session",
  );
  content = content.replaceAll(
    "_babase.get_foreground_host_activity",
    "bascenev1.get_foreground_host_activity",
  );
  content = content.replaceAll(
    "bascenev1.SessionPlayerNotFoundError",
    "babase.SessionPlayerNotFoundError",
  );
  content = content.replaceAll("bascenev1", "bs");
  content = content.replaceAll("bauiv1", "bui");
  content = content.replaceAll("import bs", "import bascenev1 as bs");
  content = content.replaceAll("import bui", "import bauiv1 as bui");
  content = content.replaceAll("bslib", "bascenev1lib");
  content = content.replaceAll("builib", "bauiv1lib");
  content = content.replaceAll("from bs.", "from bascenev1.");
  content = content.replaceAll("from bui.", "from bauiv1.");
  content = content.replaceAll(
    "import bascenev1 as bascenev1lib",
    "import bascenev1lib",
  );
  content = content.replaceAll(
    "import bauiv1 as bauiv1lib",
    "import bauiv1lib",
  );
  content = content.replaceAll(
    "# ba_meta export bs.GameActivity",
    "# ba_meta export bascenev1.GameActivity",
  );
  content = content.replaceAll("_bs", "bs");
  content = content.replaceAll(
    /bs\.Timer\(([^)]*)\bTimeType\.REAL\b([^)]*)\)/gm,
    "babase.AppTimer($1$2)",
  );

  return content;
}
