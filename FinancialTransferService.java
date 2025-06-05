import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class FinancialTransferService {

  @GetMapping("/")
  public String processTransfer() {
    return "Financial transfer processing initiated.";
  }

  public static void main(String[] args) {
    SpringApplication.run(FinancialTransferService.class, args);
  }
}

