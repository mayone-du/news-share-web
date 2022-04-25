import { Box, Tooltip } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState, VFC } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { isStartedNewsShare } from "src/utils";

export const DateTimeCard: VFC = () => {
  const [state, setState] = useState(false);

  // 1分毎に再レンダリングさせる
  useEffect(() => {
    setTimeout(() => setState(!state), 1000 * 60); // 60秒
  }, [state]);

  return (
    <Box>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-bold">{dayjs().format("MM/DD（ddd）")}</p>
          <p
            className={`font-bold text-3xl ${
              isStartedNewsShare(dayjs()) ? "text-emerald-400" : ""
            }`}
          >
            {dayjs().format("HH : mm")}
          </p>
        </div>
        <div>
          <Tooltip label={`毎日 22:45 ~ ニュースシェアが開催されます`}>
            <AiOutlineQuestionCircle />
          </Tooltip>
        </div>
      </div>
    </Box>
  );
};
