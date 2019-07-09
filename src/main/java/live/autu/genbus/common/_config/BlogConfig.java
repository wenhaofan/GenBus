package live.autu.genbus.common._config;

import java.io.File;

import com.alibaba.druid.wall.WallFilter;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.json.FastJsonFactory;
import com.jfinal.json.MixedJsonFactory;
import com.jfinal.kit.Prop;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.template.Engine;
import com.jfinal.template.source.FileSourceFactory;

/**
 * 项目配置
 * 
 * @author 作者:范文皓
 * @createDate 创建时间：2018年9月6日 下午12:38:51
 */
public class BlogConfig extends JFinalConfig {

	public static Prop p = loadConfig();

	public static String PAGE_DIY_PATH;

	private WallFilter wallFilter;

	@Override
	public void configConstant(Constants me) {
		me.setDevMode(p.getBoolean("devMode", false));
		me.setJsonFactory(new MixedJsonFactory());
		me.setJsonFactory(new FastJsonFactory());
		me.setError404View("/_view/error/404.html");
		me.setInjectDependency(true);

		BlogConfig.PAGE_DIY_PATH = File.separator + "_view" + File.separator + "diy" + File.separator + "page"
				+ File.separator;
	}

	@Override
	public void configRoute(Routes me) {
		// 配置路由

	}

	private static Prop loadConfig() {
		// 先加载开发环境配置文件 找不到再去加载生产环境配置文件
		try {

			return PropKit.use("dev_blog_config.txt");
		} catch (Exception e) {

			return PropKit.use("blog_config.txt");
		}

	}

	/**
	 * 抽取成独立的方法，例于 _Generator 中重用该方法，减少代码冗余
	 */
	public static DruidPlugin getDruidPlugin() {
		return new DruidPlugin(p.get("jdbcUrl"), p.get("userName"), p.get("pwd").trim());
	}

	public static DruidPlugin getDruidPlugin(String jdbcUrl, String user, String passWord) {
		return new DruidPlugin(jdbcUrl, user, passWord);
	}

	@Override
	public void configEngine(Engine me) {
		me.setDevMode(p.getBoolean("engineMode", false));

		me.setSourceFactory(new FileSourceFactory());

	}

	@Override
	public void configPlugin(Plugins me) {

//		DruidPlugin druidPlugin = getDruidPlugin();
//		wallFilter = new WallFilter(); // 加强数据库安全
//		wallFilter.setDbType("mysql");
//		druidPlugin.addFilter(wallFilter);
//		druidPlugin.addFilter(new StatFilter()); // 添加 StatFilter 才会有统计数据
//		
//		druidPlugin.setConnectionInitSql("set names utf8mb4");
//		
//		me.add(druidPlugin);
//
//		ActiveRecordPlugin arp = new ActiveRecordPlugin(druidPlugin);
//		arp.setTransactionLevel(Connection.TRANSACTION_READ_COMMITTED);
//		_MappingKit.mapping(arp);
//		// 强制指定复合主键的次序，避免不同的开发环境生成在 _MappingKit 中的复合主键次序不相同
//		arp.setPrimaryKey("document", "mainMenu,subMenu");
//		me.add(arp);
//		arp.setShowSql(p.getBoolean("devMode", false));
// 
//		arp.addSqlTemplate( "/sql/all_sqls.sql");
//
//		me.add(new EhCachePlugin());
//
//		KeyKit.load(p.getBoolean("devMode", false))
//				.setBaseKeyTemplatePath(PathKit.getRootClassPath() + "/email")
//				.addTemplate("all_emails.tpl")
//				.parseKeysTemplate();
//		

	}

	@Override
	public void configInterceptor(Interceptors me) {
		// 全局配置拦截器
		// me.add(new InitInterceptor());

	}

	@Override
	public void configHandler(Handlers me) {
		// me.add(new BasePathHandler("basePath"));
	}

	@Override
	public void onStart() {

	}

	@Override
	public void onStop() {

	}

}
