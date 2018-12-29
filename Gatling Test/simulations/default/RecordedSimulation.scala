package default

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class RecordedSimulation extends Simulation {
	
	val httpProtocol = http
		.baseUrl("http://localhost:9001")
		.inferHtmlResources()
		.acceptHeader("*/*")
		.acceptEncodingHeader("gzip, deflate")
		.acceptLanguageHeader("en-US,en;q=0.9")
		.userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36")


	
	val headers_0 = Map(
		"Origin" -> "null",
		"Proxy-Connection" -> "keep-alive")



	val scn = scenario("RecordedSimulation")
		.pause(2)
		.exec(http("request_2")
			.get("/questions/5")
			.headers(headers_0))
	
	setUp(scn.inject(atOnceUsers(100))).protocols(httpProtocol)
}